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
const addExercise = (workoutID: number, name: string, isCardio: boolean) => {
  const workout = unwrap(workoutStore.workouts).find((x) => x.id === workoutID);
  if (!workout) {
    throw new Error("No workout found");
  }
  const log = Promise.resolve({
    id: workout.logs.length + 1,
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
};

const addRep = (
  workoutID: number,
  logID: number,
  reps: number,
  weight: number
) => {
  const log = workoutStore.workouts
    .find((x) => x.id === workoutID)
    ?.logs.find((x) => x.id === logID);
  console.log("log ", log);
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
};

const repeatLastRep = (workoutID: number, logID: number) => {
  const lastLog = workoutStore.workouts
    .find((x) => x.id === workoutID)
    ?.logs.find((x) => x.id === logID);
  if (lastLog?.sets.length && lastLog.sets.length > 0) {
    const lastSet = lastLog.sets[lastLog.sets.length - 1];
    addRep(workoutID, logID, lastSet.reps, lastSet.weight);
  }
};

const addWorkout = (name: string) => {
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
};

const load = () => {
  setWorkoutStore({
    workouts: [dummy, dummy, dummy, dummy, dummy],
    activeWorkoutID: dummy.id,
    exerciseNames: Array.from(new Set(dummy.logs.map((x) => x.name)).values()),
  });
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
  addExercise,
  addRep,
  repeatLastRep,
  addWorkout,
  load,
};
