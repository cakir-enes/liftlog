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
import { LogData, tools, WorkoutData, workoutStore } from "./workoutstore";

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

const BottomSheet: Component<{ classes: string }> = ({ children, classes }) => (
  <Motion.div
    class={
      "h-screen w-screen fixed  top-0 left-0  backdrop-blur bg-black/10 z-20"
    }
    animate={{}}
  >
    <Motion.div
      class={
        "z-50 text-black p-2 bg-gray-200 shadow-sm  rounded-t-md fixed h-[45vh]  bottom-0  left-10 right-10 " +
        classes
      }
      initial={{ y: 2500 }}
      onViewEnter={() => {
        console.log("wuhu");
      }}
      animate={{ y: 0 }}
      exit={{ y: [4500] }}
    >
      {children}
    </Motion.div>
  </Motion.div>
);

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

  type w = "Controls" | "NewSet" | "NewExercise" | "NewWorkout";

  const [what, setWhat] = createSignal<w>("Controls");

  function clickOutside(el, accessor) {
    const onClick = (e) => !el.contains(e.target) && accessor()?.();
    document.body.addEventListener("click", onClick);

    onCleanup(() => document.body.removeEventListener("click", onClick));
  }

  const NewWorkout = () => (
    <BottomSheet classes="h-fit">
      <form class="flex flex-col h-full">
        <span class="ml-4  w-fit highlight">Workout Name:</span>
        <input type="text" class="input-simple mx-4" />
        <button
          type="submit"
          class="highlight py-2 text-lg my-4"
          onClick={(e) => {
            e.preventDefault();
            tools.addWorkout("lele");
            setWhat("Controls");
          }}
        >
          Let's Goo
        </button>
      </form>
    </BottomSheet>
  );

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
              <label for="weight-input" class="highlight mb-2">
                Weight:
              </label>
              <input
                type="number"
                id="weight-input"
                class="input-simple w-[6ch]"
              />
            </div>
            <div class="flex flex-col">
              <label for="reps-input" class="highlight mb-2">
                Reps:
              </label>
              <input
                type="number"
                id="reps-input"
                class="input-simple w-[4ch]"
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
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path
            fill-rule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

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

  const WhatComp: Record<w, Component> = {
    Controls,
    NewSet,
    NewExercise,
    NewWorkout,
  };

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
  return (
    <div class="dark flex flex-col bg-black text-white font-[Rubik]">
      <For each={tools.workouts}>
        {(w, i) => <Workout isActive={i() === 0} workout={w} />}
      </For>
      <div class="fixed -bottom-0 left-10 right-10 z-50 h-12 ">
        <ControlBar />
      </div>
    </div>
  );
};

export default App;
