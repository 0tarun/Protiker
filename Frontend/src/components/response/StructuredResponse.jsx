import SeverityBar from './SeverityBar';
import RightsSection from './RightsSection';
import StepsSection from './StepsSection';
import InfoGrid from './InfoGrid';
import WarningBox from './WarningBox';
import DeadlineBox from './DeadlineBox';
import ActionButtons from './ActionButtons';

export default function StructuredResponse({ data, streamedText, isStreaming }) {
  if (!data) return null;
  const { severity, category, rights, steps, laws, freeAid, warnings, deadline, office } = data;

  return (
    <>
      <SeverityBar severity={severity} category={category} />
      <p className="intro-text">আপনার সমস্যাটা আমি বুঝেছি।</p>
      <RightsSection rights={rights} laws={laws} streamedText={streamedText} isStreaming={isStreaming} />
      <div className="sr-divider" />
      <StepsSection steps={steps} isStreaming={isStreaming} />
      <div className="sr-divider" />
      <InfoGrid office={office} freeAid={freeAid} isStreaming={isStreaming} />
      <div className="sr-divider" />
      <WarningBox warnings={warnings} isStreaming={isStreaming} />
      <DeadlineBox deadline={deadline} isStreaming={isStreaming} />
      <ActionButtons isStreaming={isStreaming} />
    </>
  );
}
