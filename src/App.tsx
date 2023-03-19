import {
  Accessor,
  Component,
  createSignal,
  onMount,
  For,
  Show,
  Signal,
  onCleanup,
} from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import "flowbite";
import { Motion, Presence } from "@motionone/solid";
import { Modal } from "flowbite";
import type { ModalOptions, ModalInterface } from "flowbite";
import { Rerun } from "@solid-primitives/keyed";
import { Dynamic } from "solid-js/web";
import { Dumbell, Sprint } from "./icons";

export interface LogData {
  id: number;
  name: string;
  isCardio: boolean;
  durationMin: number;
  sets: { reps: number; weight: number };
  createdAt: Date;
  workoutId: number;
}

export interface WorkoutData {
  id: number;
  name: string;
  createdAt: Date;
  logs: LogData[];
}

const Log = (props: { log: LogData; i: Accessor<number> }) => {
  const format = (num: number) => {
    return (num < 10 ? `0${num}` : num) + "/";
  };

  return (
    <div class="flex w-full font-bold">
      <div class="flex flex-col">
        <span class="text-sm text-gray-400">{format(props.i() + 1)}</span>
        <span class="text-md text-gray-100">{props.log.name}</span>
      </div>
      <div class="flex justify-end grow gap-3 items-center">
        <For each={props.log.sets}>
          {(set, i) => (
            <div class="flex flex-col -space-y-1 items-center leading-4">
              <span class="block">{set.weight}</span>
              <span class="block text-xs mb-2">·</span>
              <span class="block">{set.reps}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

const Workout = (props: { workout: WorkoutData; isActive: boolean }) => {
  const DetailsBtn = () => (
    <button class="flex gap-0.5">
      <circle class="bg-gray-400 w-1 h-1 rounded-full" />
      <circle class="bg-gray-400 w-1 h-1 rounded-full" />
      <circle class="bg-gray-400 w-1 h-1 rounded-full" />
    </button>
  );

  return (
    <div class="rounded-lg shadow-lg p-4 ">
      <div class="flex mb-4 items-center justify-between">
        <div class="flex items-center">
          <span class="text-lg font-bold block">{props.workout.name}</span>
          <circle class="bg-green-400 w-1 h-1 rounded-full mx-2" />
          <span class="text-xs">
            {props.workout.createdAt.toLocaleDateString()}
          </span>
        </div>
        <Show when={props.isActive} fallback={<DetailsBtn />}>
          <button class="block flex items-center font-bold px-1 py-[2px] rounded-sm h-min text-xs bg-green-400 text-black">
            FIN
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </Show>
      </div>
      <div class="flex flex-col gap-2">
        <For each={props.workout.logs}>
          {(log, i) => <Log log={log} i={i} />}
        </For>
      </div>
    </div>
  );
};

const ControlBar = () => {
  const [showNewMove, setShowNewMove] = createSignal(false);
  let ref;
  let modal: ModalInterface;

  const modalOptions: ModalOptions = {
    placement: "center",
    backdrop: "dynamic",
    backdropClasses:
      "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
    closable: true,
    onHide: () => {
      console.log("modal is hidden");
    },
    onShow: () => {
      console.log("modal is shown");
    },
    onToggle: () => {
      console.log("modal has been toggled");
    },
  };

  const [ready, setReady] = createSignal(false);

  const showModal = () => {
    console.log("called");
    setShowNewMove((x) => !x);
    // modal._targetEl = ref
    // modal.show()
  };

  onMount(() => {
    modal = new Modal(ref, modalOptions);
  });

  const viewLeft = () => {
    console.log("Ready", ready());
    setReady(true);
    console.log("Ready>", ready());
  };
  const viewEnter = () => {
    console.log("view entered");
    setReady(false);
  };

  type w = "Controls" | "NewSet" | "NewExercise";
  const [what, setWhat] = createSignal<w>("NewExercise");

  function clickOutside(el, accessor) {
    console.log("wololo");
    const onClick = (e) => !el.contains(e.target) && accessor()?.();
    document.body.addEventListener("click", onClick);

    onCleanup(() => document.body.removeEventListener("click", onClick));
  }

  const NewSet = () => (
    <Motion.div
      class="h-screen w-screen fixed  top-0 left-0  backdrop-blur bg-black/10 z-20"
      animate={{}}
    >
      <Motion.div
        class="z-50 text-black p-2 bg-gray-200 shadow-sm  rounded-t-md fixed h-[45vh]  bottom-0  left-10 right-10"
        initial={{ y: 2500 }}
        onViewEnter={() => {
          console.log("wuhu");
        }}
        animate={{ y: 0 }}
        exit={{ y: [4500] }}
      >
        <div
          class="flex flex-col h-full w-full items-center text-center"
          use:clickOutside={() => {
            setWhat("Controls");
          }}
        >
          <form class="flex flex-col flex-wrap gap-5 mt-3">
            <div class="flex flex-col">
              <label
                for="weight-input"
                class="block mb-2 px-1 rounded-sm bg-black text-white text-sm font-medium"
              >
                Weight:
              </label>
              <input
                type="number"
                id="weight-input"
                class="block text-center mx-auto text-4xl w-[6ch] border-x-0 focus:ring-0 pb-0 focus:border-b-yellow-900 border-t-0 w-full box-border  border-b-2 border-b-black   bg-transparent"
              />
            </div>
            <div class="flex flex-col">
              <label
                for="reps-input"
                class="block mb-2 px-1 rounded-sm bg-black text-white text-sm font-medium"
              >
                Reps:
              </label>
              <input
                type="number"
                id="reps-input"
                class="block text-center mx-auto text-4xl border-x-0 w-[4ch] focus:ring-0 pb-0 focus:border-b-yellow-900 border-t-0 w-full box-border  border-b-2 border-b-black   bg-transparent"
              />
            </div>
            <button type="submit" class="mx-auto mb-4">
              <Dumbell classes="w-16 h-16 " />
            </button>
          </form>
        </div>
      </Motion.div>
    </Motion.div>
  );
  const [newExerciseIsLift, setNewExerciseIsLift] = createSignal(true);

  const NewExercise = () => (
    <Motion.div
      class="h-screen w-screen fixed  top-0 left-0  backdrop-blur bg-black/10 z-20"
      animate={{}}
    >
      <Motion.div
        class="z-50 text-black p-2 bg-gray-200 shadow-sm  rounded-t-md fixed h-[40vh]  bottom-0  left-10 right-10"
        initial={{ y: 2500 }}
        animate={{ y: 0 }}
        exit={{ y: [4500] }}
      >
        <div
          class="flex flex-col h-full w-full items-center text-center"
          use:clickOutside={() => setWhat("Controls")}
        >
          <form class="flex flex-row flex-wrap justify-center gap-4">
            <div class="relative flex w-full">
              <div class="absolute inset-y-0 left-0 flex items-center pl-1">
                <Presence>
                  <Rerun on={newExerciseIsLift}>
                    <Motion.button
                      class=""
                      animate={{ rotateY: [90, 0] }}
                      onClick={() => {
                        setNewExerciseIsLift((x) => !x);
                      }}
                    >
                      <Dynamic
                        component={
                          newExerciseIsLift() ? (
                            <Dumbell classes="w-6 h-6" />
                          ) : (
                            <Sprint classes="w-6 h-6" />
                          )
                        }
                      />
                    </Motion.button>
                  </Rerun>
                </Presence>
              </div>
              <input
                type="text"
                id="default-search"
                class="block w-full p-0 py-3 pl-10 ring-0 focus:ring-0 focus:border-b-black text-sm text-black border-t-0 border-x-0 border-b border-black bg-transparent"
                placeholder="Search / Create"
                required
              />
              <button
                type="submit"
                class="text-white absolute right-2.5 bottom-2.5 bg-black  font-medium rounded-md focus:ring-0 focus:border-none text-sm px-1 py-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
            <div class="basis-full h-0 w-0" />
            <ul class="flex flex-wrap justify-start w-full -mt-5 gap-2">
              <li class="block px-1 bg-black rounded-sm font-medium text-sm text-white">
                lololo
              </li>
              <li class="block px-1 bg-black rounded-sm font-semibold text-sm text-white">
                wiii
              </li>
              <li class="block px-1 bg-black rounded-sm font-semibold text-sm text-white">
                wowo ow owo wo a
              </li>
            </ul>
          </form>
        </div>
      </Motion.div>
    </Motion.div>
  );

  const Controls = () => (
    <Motion.div
      animate={{ opacity: [0, 100], scale: [0.2, 1] }}
      exit={{ scale: [1, 0] }}
      class="flex bg-white text-black h-full shadow-sm  rounded-t-md"
      role="group"
      onViewEnter={viewEnter}
      onViewLeave={viewLeft}
    >
      <button
        type="button"
        class="inline-flex items-center px-4 py-2  bg-transparent border border-gray-100 rounded-l-lg justify-center grow"
      ></button>

      <button
        onClick={() => {
          setWhat("NewExercise");
        }}
        type="button"
        class="inline-flex items-center px-4 py-2  bg-transparent border border-gray-100 rounded-l-lg justify-center grow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => {
          setWhat("NewSet");
        }}
        class="inline-flex items-center px-4 py-2  bg-transparent  rounded-l-lg justify-center grow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path d="M6 3a3 3 0 00-3 3v2.25a3 3 0 003 3h2.25a3 3 0 003-3V6a3 3 0 00-3-3H6zM15.75 3a3 3 0 00-3 3v2.25a3 3 0 003 3H18a3 3 0 003-3V6a3 3 0 00-3-3h-2.25zM6 12.75a3 3 0 00-3 3V18a3 3 0 003 3h2.25a3 3 0 003-3v-2.25a3 3 0 00-3-3H6zM17.625 13.5a.75.75 0 00-1.5 0v2.625H13.5a.75.75 0 000 1.5h2.625v2.625a.75.75 0 001.5 0v-2.625h2.625a.75.75 0 000-1.5h-2.625V13.5z" />
        </svg>
      </button>
    </Motion.div>
  );

  const WhatComp: Record<w, Component> = { Controls, NewSet, NewExercise };

  return (
    <>
      <Presence>
        <Rerun on={what}>
          <Dynamic component={WhatComp[what()]} />
        </Rerun>
      </Presence>
    </>
  );
};

const App: Component = () => {
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
  return (
    <div class="dark min-h-screen flex flex-col bg-black text-white font-[Rubik]">
      <Workout isActive workout={dummy} />
      <Workout workout={dummy} />
      <div class="fixed -bottom-0 left-10 right-10 z-50 h-12 ">
        <ControlBar />
      </div>
    </div>
  );
};

export default App;
