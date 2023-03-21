import { createStore, produce, unwrap } from "solid-js/store";
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
  workouts: [] as WorkoutData[],
  activeWorkoutID: undefined as undefined | number,
  exerciseNames: [] as string[],
});

export const tools = {
  get workouts() {
    return workoutStore.workouts;
  },
  get activeWorkoutID() {
    return workoutStore.activeWorkoutID;
  },
  get exerciseNames() {
    return ["Bench Press", "Incline Press", "Squat", "Deadlift", "Pullups"];
  },
  addExercise: (workoutID: number, name: string, isCardio: boolean) => {
    const workout = unwrap(workoutStore.workouts).find(
      (x) => x.id === workoutID
    );
    if (!workout) {
      throw new Error("No workout found");
    }
    const log = Promise.resolve({
      id: workout.logs.length,
      name,
      isCardio,
      durationMin: 0,
      sets: [],
      createdAt: new Date(),
      workoutId: workoutID,
    } as LogData);

    log.then((x) =>
      setWorkoutStore("workouts", (l) =>
        l.map((w) =>
          w.id === workoutID
            ? {
                ...w,
                logs: [...w.logs, x],
              }
            : w
        )
      )
    );
  },
  addRep: (workoutID: number, logID: number, reps: number, weight: number) => {
    const log = unwrap(workoutStore.workouts)
      .find((x) => x.id === workoutID)
      ?.logs.find((x) => x.id === logID);
    console.log(
      "ahanda ",
      unwrap(workoutStore.workouts).find((x) => x.id === workoutID),
      "og",
      logID
    );
    if (!log) {
      throw new Error("No log found");
    }
    setWorkoutStore(
      produce((s) => {
        s.workouts
          .find((x) => x.id === workoutID)
          ?.logs.find((x) => x.id === logID)
          ?.sets.push({ reps, weight });
      })
    );
  },
  addWorkout: (name: string) => {
    const workout = Promise.resolve({
      id: workoutStore.workouts.length,
      name,
      createdAt: new Date(),
      logs: [] as LogData[],
    } as WorkoutData);
    workout.then((x) => {
      setWorkoutStore("activeWorkoutID", x.id);
      setWorkoutStore("workouts", (l) => [x, ...l]);
    });
  },
};
