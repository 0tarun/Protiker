/**
 * DocumentFormPage — Multi-step smart form with live document preview.
 * No sidebar — uses its own two-column layout (form left, preview right).
 * Features: step navigation, AI prefill indicators, live preview, success modal.
 * Route: /documents/create/:templateSlug
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, FileText, Sparkles, CheckCircle,
  Download, Eye, Loader2
} from 'lucide-react';
import documentService from '../services/documentService';
import '../styles/documents.css';

export default function DocumentFormPage() {
  const { templateSlug, id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* State */
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [stepKey, setStepKey] = useState(0);
  const [newDocId, setNewDocId] = useState(null);

  /* Reinforce case context from URL search params */
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlCaseId = searchParams.get('caseId');
    if (urlCaseId) {
      const existingContextStr = localStorage.getItem('protiker_case_context');
      if (existingContextStr) {
        try {
          const parsed = JSON.parse(existingContextStr);
          if (parsed.caseId !== urlCaseId) {
            localStorage.setItem('protiker_case_context', JSON.stringify({ caseId: urlCaseId }));
          }
        } catch (e) {
          localStorage.setItem('protiker_case_context', JSON.stringify({ caseId: urlCaseId }));
        }
      } else {
        localStorage.setItem('protiker_case_context', JSON.stringify({ caseId: urlCaseId }));
      }
    }
  }, []);

  /* Fetch template or document details */
  useEffect(() => {
    async function loadData() {
      try {
        if (id) {
          const docRes = await documentService.getDocumentDetails(id);
          if (docRes.success && docRes.data) {
             const docData = docRes.data;
             setFormValues(docData.fieldValues || {});
             const tmplRes = await documentService.getTemplateDetails(docData.templateSlug);
             if (tmplRes.success && tmplRes.data) {
               setTemplate(tmplRes.data);
               setFields(tmplRes.data.fields || []);
             } else {
               navigate('/documents');
             }
          } else {
             navigate('/documents');
          }
        } else if (templateSlug) {
          const res = await documentService.getTemplateDetails(templateSlug);
          if (res.success && res.data) {
            setTemplate(res.data);
            setFields(res.data.fields || []);
          } else {
            navigate('/documents/new');
          }
        }
      } catch (e) {
        console.error('Failed to load document/template details', e);
        navigate('/documents');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [templateSlug, id, navigate]);

  /* Group fields by step */
  const steps = useMemo(() => {
    const map = {};
    fields.forEach((f) => {
      if (!map[f.step]) map[f.step] = [];
      map[f.step].push(f);
    });
    return Object.keys(map).sort((a, b) => a - b).map((k) => map[k]);
  }, [fields]);

  const totalSteps = steps.length || 1;

  const handleChange = useCallback((fieldKey, value) => {
    setFormValues((prev) => ({ ...prev, [fieldKey]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((p) => p + 1);
      setStepKey((k) => k + 1);
    }
  }, [currentStep, totalSteps]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
      setStepKey((k) => k + 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async (isDraft = false) => {
    setSubmitting(true);
    try {
      const sessionIdStr = localStorage.getItem('protiker_chat_session');
      const payload = {
        templateSlug: template?.slug || templateSlug,
        fieldValues: formValues,
        saveAsDraft: isDraft,
        generationMethod: sessionIdStr ? 'CHAT_LINKED' : 'STANDALONE',
        language: 'BN'
      };

      if (sessionIdStr && !isNaN(sessionIdStr)) {
         payload.chatSessionId = parseInt(sessionIdStr, 10);
      }

      let res;
      if (id) {
        res = await documentService.updateDocument(id, payload);
      } else {
        res = await documentService.createDocument(payload);
      }
      
      if (res.success && res.data) {
        if (isDraft) {
          navigate('/documents');
        } else {
          localStorage.setItem('protiker_new_doc', JSON.stringify({
            id: res.data.id,
            name: template?.nameBn || 'আইনি দলিল'
          }));
          setNewDocId(res.data.id);
          setShowSuccess(true);

          // Auto-download generated document PDF
          try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.createElement('div');
            element.innerHTML = `<pre style="font-family: sans-serif; white-space: pre-wrap; font-size: 14px; padding: 40px; line-height: 1.6;">${res.data.generatedContent}</pre>`;
            
            const opt = {
              margin:       10,
              filename:     `protiker-document-${res.data.id}.pdf`,
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:  { scale: 2 },
              jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
          } catch (pdfErr) {
            console.error('Auto download failed', pdfErr);
          }
        }
      }
    } catch (e) {
      console.error('Failed to save document', e);
      alert(e?.response?.data?.message || 'দলিল সেভ করতে সমস্যা হয়েছে। অনুগ্রহ করে সব তথ্য সঠিকভাবে দিন।');
    } finally {
      setSubmitting(false);
    }
  }, [formValues, templateSlug, id, template, navigate]);

  /* Progress */
  const filledCount = fields.filter((f) => formValues[f.fieldKey]?.trim()).length;
  const percent = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

  const isLastStep = currentStep === totalSteps - 1;
  const currentFields = steps[currentStep] || [];

  /* Check for chat session (AI prefill) */
  const hasSession = !!localStorage.getItem('protiker_chat_session');

  /* Render field by type */
  const renderField = (field) => {
    const val = formValues[field.fieldKey] || '';
    switch (field.fieldType) {
      case 'textarea':
        return (
          <textarea
            className="doc-field-textarea"
            placeholder={field.placeholderBn}
            value={val}
            onChange={(e) => handleChange(field.fieldKey, e.target.value)}
            id={`field-${field.fieldKey}`}
          />
        );
      case 'select':
        return (
          <select
            className="doc-field-select"
            value={val}
            onChange={(e) => handleChange(field.fieldKey, e.target.value)}
            id={`field-${field.fieldKey}`}
          >
            <option value="">-- বেছে নিন --</option>
            {(field.selectOptions || []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            className="doc-field-input"
            type="date"
            value={val}
            onChange={(e) => handleChange(field.fieldKey, e.target.value)}
            id={`field-${field.fieldKey}`}
          />
        );
      case 'phone':
      case 'text':
      default:
        return (
          <input
            className="doc-field-input"
            type={field.fieldType === 'phone' ? 'tel' : 'text'}
            placeholder={field.placeholderBn}
            value={val}
            onChange={(e) => handleChange(field.fieldKey, e.target.value)}
            id={`field-${field.fieldKey}`}
          />
        );
    }
  };

  if (loading || !template) {
    return (
      <div className="doc-form-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" color="#1D9E75" size={48} />
      </div>
    );
  }

  return (
    <div className="doc-form-layout">
      {/* ── LEFT: Form Panel ── */}
      <div className="doc-form-left">
        <button className="doc-back-link" onClick={() => navigate('/documents/new')}>
          <ChevronLeft size={20} /> দলিল বেছে নিন
        </button>

        <div style={{ marginTop: 24 }}>
          <div className="doc-form-badge">
            <FileText size={12} /> {template.nameEn}
          </div>
          <div className="doc-form-title">{template.nameBn}</div>
          <div className="doc-form-law">{template.legalBasis}</div>
        </div>

        {/* Progress bar */}
        <div className="doc-progress">
          <div className="doc-progress-labels">
            <span className="doc-progress-step">ধাপ {currentStep + 1} / {totalSteps}</span>
            <span className="doc-progress-pct">{percent}% সম্পন্ন</span>
          </div>
          <div className="doc-progress-track">
            <div className="doc-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* AI prefill notice */}
        {hasSession && (
          <div className="doc-ai-notice">
            <Sparkles size={16} color="#1D9E75" />
            <span className="doc-ai-notice-text">
              Proti আপনার চ্যাট থেকে কিছু তথ্য স্বয়ংক্রিয়ভাবে পূরণ করেছে।
            </span>
          </div>
        )}

        {/* Current step fields */}
        <div key={stepKey} className="doc-step-animated">
          {currentFields.map((field) => (
            <div className="doc-field-group" key={field.id}>
              <label className="doc-field-label" htmlFor={`field-${field.fieldKey}`}>
                {field.labelBn}
                {field.required && <span className="doc-field-required">*</span>}
                {field.canPrefillFromChat && (
                  <span className="doc-field-ai-tag">
                    <Sparkles size={9} /> AI
                  </span>
                )}
              </label>
              {renderField(field)}
              {field.hintBn && <div className="doc-field-hint">{field.hintBn}</div>}
            </div>
          ))}
        </div>

        {/* Step navigation */}
        <div className="doc-step-nav">
          {currentStep > 0 && (
            <button className="doc-btn-step doc-btn-step-prev" onClick={goPrev}>
              <ChevronLeft size={16} /> পূর্ববর্তী
            </button>
          )}
          {isLastStep ? (
            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
              <button 
                className="doc-btn-cancel" 
                onClick={() => handleSubmit(true)} 
                disabled={submitting}
                style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '14px', height: '44px', display: 'flex', alignItems: 'center' }}
              >
                খসড়া সেভ করুন
              </button>
              <button className="doc-btn-step doc-btn-generate" onClick={() => handleSubmit(false)} id="doc-generate-btn" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    <span>দলিল তৈরি করুন</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button className="doc-btn-step doc-btn-step-next" onClick={goNext}>
              <span>পরবর্তী</span> <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT: Live Preview ── */}
      <div className="doc-form-right">
        <div className="doc-preview-header">
          <span className="doc-preview-title">লাইভ প্রিভিউ · Live Preview</span>
        </div>

        <div className="doc-preview-paper">
          <div className="doc-preview-watermark">PROTIKER — প্রতিকার</div>
          <div className="doc-preview-doc-title">{template.nameBn}</div>
          <div className="doc-preview-law-ref">{template.legalBasis}</div>
          <div className="doc-preview-divider" />

          {fields.map((field) => {
            const val = formValues[field.fieldKey];
            return (
              <div className="doc-preview-section" key={field.id}>
                <div className="doc-preview-label">{field.labelBn}</div>
                <div className={`doc-preview-value${!val ? ' doc-preview-placeholder' : ''}`}>
                  {val || `[${field.labelBn}]`}
                </div>
              </div>
            );
          })}

          <div className="doc-preview-divider" />
          <div className="doc-preview-section">
            <div className="doc-preview-label">বরাবর</div>
            <div className="doc-preview-value">{template.addressedTo}</div>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="doc-modal-overlay" onClick={() => setShowSuccess(false)}>
          <div className="doc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="doc-modal-icon">
              <CheckCircle size={32} />
            </div>
            <div className="doc-modal-title">দলিল সফলভাবে তৈরি হয়েছে! ✅</div>
            <div className="doc-modal-sub">
              আপনার "{template.nameBn}" তৈরি হয়ে গেছে।
              নিচের বোতামগুলো ব্যবহার করে এটি ডাউনলোড করতে বা দেখতে পারেন।
            </div>
            <div className="doc-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button className="doc-btn-primary" style={{ flex: 1 }} onClick={() => navigate(`/documents/${newDocId}`)}>
                  <Eye size={16} /> দলিল দেখুন
                </button>
                <button 
                  className="doc-btn-primary" 
                  style={{ flex: 1, background: '#378ADD', borderColor: '#378ADD' }} 
                  onClick={async () => {
                    try {
                      const detailRes = await documentService.getDocumentDetails(newDocId);
                      if (detailRes.success && detailRes.data) {
                        const html2pdf = (await import('html2pdf.js')).default;
                        const element = document.createElement('div');
                        element.innerHTML = `<pre style="font-family: sans-serif; white-space: pre-wrap; font-size: 14px; padding: 40px; line-height: 1.6;">${detailRes.data.generatedContent}</pre>`;
                        const opt = {
                          margin:       10,
                          filename:     `protiker-document-${newDocId}.pdf`,
                          image:        { type: 'jpeg', quality: 0.98 },
                          html2canvas:  { scale: 2 },
                          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        };
                        await html2pdf().set(opt).from(element).save();
                      }
                    } catch (err) {
                      console.error(err);
                      alert('ডাউনলোড করতে সমস্যা হয়েছে।');
                    }
                  }}
                >
                  <Download size={16} /> ডাউনলোড করুন
                </button>
              </div>
              <button className="doc-btn-cancel" style={{ width: '100%' }} onClick={() => navigate('/documents')}>
                দলিল তালিকায় যান
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { DocumentFormPage };
