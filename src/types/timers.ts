export interface Timer {
    type: string;
    settings: {
      currentPhase?: 'Work' | 'Rest';
      totalSeconds?: number;
      rounds?: number;
      workSeconds?: number;
      restSeconds?: number;
    };
    state: 'not_started' | 'running' | 'completed';
  }