// RecruiterWorkflowStepper.jsx - Intuitive Guided Lifecycle for Recruiters
import React from 'react';
import { 
  Sliders, 
  UploadCloud, 
  Users, 
  CheckCircle2, 
  Kanban,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function RecruiterWorkflowStepper({ activeTab, setActiveTab, candidateCounts }) {
  const steps = [
    {
      id: 'jd-scorecard',
      num: 1,
      title: 'Configure Scorecard',
      sub: 'Criteria & Weights',
      icon: Sliders
    },
    {
      id: 'bulk-upload',
      num: 2,
      title: 'Ingest Resumes',
      sub: 'Upload CVs',
      icon: UploadCloud
    },
    {
      id: 'ranked-list',
      num: 3,
      title: 'Screen & Match',
      sub: `${candidateCounts.screened} in pool`,
      icon: Users
    },
    {
      id: 'pipeline',
      num: 4,
      title: 'Pipeline & Submit',
      sub: `${candidateCounts.submitted} to client`,
      icon: Kanban
    }
  ];

  const currentStepIdx = steps.findIndex(s => s.id === activeTab);

  return (
    <div className="recruiter-stepper-container">
      <div className="stepper-header-row">
        <div className="stepper-label-group">
          <span className="stepper-kicker">Recruiter Guided Workflow</span>
          <span className="stepper-title">5-Stage Fair Sourcing & Submission Process</span>
        </div>
        <span className="stepper-guidance-pill">
          <Sparkles size={12} />
          <span>Stage {currentStepIdx >= 0 ? currentStepIdx + 1 : 1} of 4: {steps[currentStepIdx >= 0 ? currentStepIdx : 0].title}</span>
        </span>
      </div>

      <div className="stepper-steps-track">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = activeTab === step.id;
          const isCompleted = currentStepIdx > idx;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                className={`stepper-node-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setActiveTab(step.id)}
                title={`Jump to Step ${step.num}: ${step.title}`}
              >
                <div className="stepper-node-circle">
                  {isCompleted ? <CheckCircle2 size={14} /> : <span>{step.num}</span>}
                </div>
                <div className="stepper-node-meta">
                  <span className="stepper-node-title">{step.title}</span>
                  <span className="stepper-node-sub">{step.sub}</span>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div className={`stepper-connector-line ${currentStepIdx > idx ? 'completed' : ''}`}>
                  <ChevronRight size={13} className="connector-chevron" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

