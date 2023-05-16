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
const d = new Date();
d.setDate(d.getDate() - 1);

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const dummy = (i: number) => {
  const wid = uuidv4();

  return {
    id: wid,
    name: "Chest",
    createdAt: d,
    logs: [
      {
        id: uuidv4(),
        name: "Bench Press",
        isCardio: false,
        durationMin: 0,
        sets: [
          { reps: 10, weight: 45 },
          { reps: 10, weight: 80 },
          { reps: 15, weight: 53 },
        ],
        createdAt: d,
        workoutId: wid,
      },
      {
        id: uuidv4(),
        name: "incline",
        isCardio: false,
        durationMin: 0,
        sets: [
          { reps: 10, weight: 45 },
          { reps: 10, weight: 80 },
          { reps: 15, weight: 53 },
        ],
        createdAt: d,
        workoutId: wid,
      },
    ],
  };
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
  reps: number,
  weight: number,
  logID?: number,
  workoutID?: number
) => {
  setWorkoutStore(
    produce((s) => {
      if (workoutID !== undefined) {
        const workout = s.workouts.find((x) => x.id === workoutID);
        if (!workout) {
          throw new Error("No workout found");
        }
        if (logID !== undefined) {
          const log = workout.logs.find((x) => x.id === logID);
          if (!log) {
            throw new Error("No log found");
          }
          log.sets.push({ reps, weight });
        } else {
          workout.logs[0].sets.push({ reps, weight });
        }
        return;
      }
      const workout = s.workouts.find((x) => x.id === s.activeWorkoutID);
      if (!workout) {
        throw new Error("No workout found");
      }
      if (logID !== undefined) {
        const log = workout.logs.find((x) => x.id === logID);
        if (!log) {
          throw new Error("No log found");
        }
        log.sets.push({ reps, weight });
      } else {
        workout.logs[0].sets.push({ reps, weight });
      }
    })
  );
};

const repeatLastRep = (workoutID: number, logID: number) => {
  const lastLog = workoutStore.workouts
    .find((x) => x.id === workoutID)
    ?.logs.find((x) => x.id === logID);
  if (lastLog?.sets.length && lastLog.sets.length > 0) {
    const lastSet = lastLog.sets[lastLog.sets.length - 1];
    addRep(lastSet.reps, lastSet.weight, logID, workoutID);
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
    setWorkoutStore(
      produce((s) => {
        s.workouts.unshift(x);
        s.activeWorkoutID = x.id;
      })
    );
    // setWorkoutStore("activeWorkoutID", x.id);
    // setWorkoutStore("workouts", (l) => [x, ...l]);
  });
};

const load = () => {
  const d = dummy(0);
  setWorkoutStore({
    workouts: [d, dummy(2), dummy(5)],
    activeWorkoutID: d.id,
    exerciseNames: Array.from(new Set(d.logs.map((x) => x.name)).values()),
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
