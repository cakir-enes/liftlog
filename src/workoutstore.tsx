import { createStore, unwrap } from "solid-js/store";
export interface LogData {
  id: number;
  name: string;
  isCardio: boolean;
  durationMin: number;
  sets: { reps: number; weight: number }[];
  createdAt: Date;
  workoutId: number;
}

export interface WorkoutData {
  id: number;
  name: string;
  createdAt: Date;
  logs: LogData[];
}
const dummy = {
  id: 1,
  name: "Chest",
  createdAt: new Date(),
  logs: [
    {
      id: 1,
      name: "Bench Press",
      isCardio: false,
      durationMin: 0,
      sets: [
        { reps: 10, weight: 45 },
        { reps: 10, weight: 80 },
        { reps: 15, weight: 53 },
      ],
      createdAt: new Date(),
      workoutId: 1,
    },
    {
      id: 2,
      name: "incline",
      isCardio: false,
      durationMin: 0,
      sets: [
        { reps: 10, weight: 45 },
        { reps: 10, weight: 80 },
        { reps: 15, weight: 53 },
      ],
      createdAt: new Date(),
      workoutId: 1,
    },
  ],
};

export const [workoutStore, setWorkoutStore] = createStore({
  workouts: [dummy] as WorkoutData[],
});

export const tools = {
  get workouts() {
    return workoutStore.workouts;
  },
  addWorkout: (name: string) => {
    const workout = Promise.resolve({
      id: 3,
      name,
      createdAt: new Date(),
      logs: [] as LogData[],
    } as WorkoutData);
    workout.then((x) => setWorkoutStore("workouts", (l) => [x, ...l]));
  },
};
