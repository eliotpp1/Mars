const SpaceProgressBar = ({ currentStep = 1, totalSteps = 5 }) => {
  // Valider les props
  const safeCurrentStep = Number.isFinite(currentStep) ? currentStep : 1;
  const safeTotalSteps =
    Number.isFinite(totalSteps) && totalSteps > 0 ? totalSteps : 5;

  // Ensure current step is within bounds
  const validCurrentStep = Math.max(
    1,
    Math.min(safeCurrentStep, safeTotalSteps)
  );

  // Space journey steps with labels
  const steps = [
    { label: "Terre", color: "#4ade80" },
    { label: "Ciel", color: "#60a5fa" },
    { label: "Espace", color: "#818cf8" },
    { label: "Lune", color: "#d1d5db" },
    { label: "Mars", color: "#ef4444" },
  ];

  const styles = {
    container: {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 50,
      backgroundColor: "rgba(17, 24, 39, 0.85)",
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid #312e81",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
      width: "280px",
    },
    missionHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    rocket: {
      marginRight: "8px",
      color: "#3b82f6",
      fontSize: "20px",
    },
    missionText: {
      color: "white",
      fontWeight: "bold",
      fontSize: "14px",
    },
    progressBarContainer: {
      position: "relative",
      height: "8px",
      backgroundColor: "#1f2937",
      borderRadius: "9999px",
      marginBottom: "24px",
      overflow: "hidden",
    },
    starsBackground: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
    },
    progressBarFill: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      background: "linear-gradient(to right, #2563eb, #7c3aed)",
      borderRadius: "9999px",
      transition: "width 700ms ease-out",
      width: `${(validCurrentStep / safeTotalSteps) * 100}%`,
    },
    stepsContainer: {
      display: "flex",
      justifyContent: "space-between",
      position: "relative",
    },
    stepItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },
    connector: (completed) => ({
      position: "absolute",
      height: "2px",
      top: "12px",
      width: "40px",
      right: "-20px",
      backgroundColor: completed ? "#3b82f6" : "#374151",
    }),
    stepIcon: (isCompleted, isCurrent, color) => ({
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "4px",
      backgroundColor: isCompleted ? "#3b82f6" : isCurrent ? color : "#4b5563",
      boxShadow: isCurrent ? "0 0 0 2px rgba(255, 255, 255, 0.7)" : "none",
      animation: isCurrent ? "pulse 2s infinite" : "none",
    }),
    iconInner: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    stepLabel: (isCurrent) => ({
      fontSize: "11px",
      color: isCurrent ? "white" : "#9ca3af",
      fontWeight: isCurrent ? "bold" : "normal",
    }),
    "@keyframes pulse": {
      "0%": { opacity: 1 },
      "50%": { opacity: 0.6 },
      "100%": { opacity: 1 },
    },
  };

  try {
    return (
      <div style={styles.container}>
        <div style={styles.missionHeader}>
          <div style={styles.rocket}>🚀</div>
          <span style={styles.missionText}>
            Mission: {steps[validCurrentStep - 1]?.label || "Unknown"}
          </span>
        </div>

        <div style={styles.progressBarContainer}>
          <div style={styles.starsBackground}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  opacity: 0.7,
                  width: "2px",
                  height: "2px",
                  top: Math.random() * 8,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          <div style={styles.progressBarFill} />
        </div>

        <div style={styles.stepsContainer}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < validCurrentStep;
            const isCurrent = stepNumber === validCurrentStep;

            return (
              <div key={index} style={styles.stepItem}>
                {index < steps.length - 1 && (
                  <div style={styles.connector(isCompleted)} />
                )}
                <div
                  style={styles.stepIcon(isCompleted, isCurrent, step.color)}
                >
                  <div style={styles.iconInner} />
                </div>
                {(isCompleted || isCurrent) && (
                  <span style={styles.stepLabel(isCurrent)}>{step.label}</span>
                )}
              </div>
            );
          })}
        </div>

        <style>
          {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}
        </style>
      </div>
    );
  } catch (error) {
    console.error("Error in SpaceProgressBar:", error);
    return <div>Error rendering SpaceProgressBar</div>;
  }
};

export default SpaceProgressBar;
