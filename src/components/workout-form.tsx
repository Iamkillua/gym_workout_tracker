"use client"

import {
  ActivityIcon,
  CheckIcon,
  ChevronRightIcon,
  DumbbellIcon,
  PlusIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react"
import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { useFormStatus } from "react-dom"

import {
  saveWorkoutSessionAction,
  type WorkoutSessionFormState,
} from "@/app/actions/workouts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type {
  MuscleGroup,
  WorkoutSessionCategory,
  WorkoutType,
} from "@/db/schema"
import {
  muscleGroupLabels,
  strengthMuscleGroups,
  type SuggestedExercise,
  type WorkoutSuggestions,
} from "@/lib/workout-planning"
import { cn } from "@/lib/utils"

type PlannedExercise = Omit<SuggestedExercise, "id"> & {
  clientId: string
  completed: boolean
}

const initialWorkoutSessionState: WorkoutSessionFormState = {
  message: null,
  fieldErrors: {},
  focusField: null,
}

export type RepeatWorkoutPlan = {
  id: string
  category: WorkoutSessionCategory
  performedOn: string
  exercises: SuggestedExercise[]
}

const zoneLayout: Array<{
  group: (typeof strengthMuscleGroups)[number]
  view: "FRONT" | "BACK"
  position: string
}> = [
  { group: "SHOULDERS", view: "FRONT", position: "row-start-1" },
  { group: "CHEST", view: "FRONT", position: "row-start-2" },
  { group: "BICEPS", view: "FRONT", position: "row-start-3" },
  { group: "BACK", view: "BACK", position: "row-start-1" },
  { group: "TRICEPS", view: "BACK", position: "row-start-2" },
]

function plannedFromSuggestion(
  exercise: SuggestedExercise,
  prefix: string
): PlannedExercise {
  return {
    clientId: `${prefix}-${exercise.id}`,
    completed: false,
    muscleGroup: exercise.muscleGroup,
    type: exercise.type,
    name: exercise.name,
    weightKg: exercise.weightKg,
    reps: exercise.reps,
    sets: exercise.sets,
    durationMinutes: exercise.durationMinutes,
    steps: exercise.steps,
    calories: exercise.calories,
    distanceKm: exercise.distanceKm,
    sourcePerformedOn: exercise.sourcePerformedOn,
  }
}

function blankExercise(group: MuscleGroup, clientId: string): PlannedExercise {
  const cardio = group === "CARDIO"
  return {
    clientId,
    completed: true,
    muscleGroup: group,
    type: cardio ? "TREADMILL" : "STRENGTH",
    name: "",
    weightKg: null,
    reps: null,
    sets: null,
    durationMinutes: null,
    steps: null,
    calories: null,
    distanceKm: null,
    sourcePerformedOn: null,
  }
}

function localDateString() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10)
}

function exerciseTypeLabel(type: WorkoutType) {
  return {
    STRENGTH: "Weighted",
    BODYWEIGHT: "Bodyweight",
    TREADMILL: "Treadmill",
    CYCLING: "Cycling",
  }[type]
}

function NumericField({
  id,
  label,
  value,
  min,
  max,
  step,
  required,
  error,
  onChange,
}: {
  id: string
  label: string
  value: number | null
  min: number
  max: number
  step?: number
  required: boolean
  error?: string
  onChange: (value: number | null) => void
}) {
  const errorId = `${id}-error`

  return (
    <label className="atlas-metric">
      <span>{label}</span>
      <Input
        id={id}
        type="number"
        inputMode={step && step < 1 ? "decimal" : "numeric"}
        min={min}
        max={max}
        step={step}
        value={value ?? ""}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) =>
          onChange(event.target.value === "" ? null : Number(event.target.value))
        }
      />
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </label>
  )
}

function SessionSubmit({ count }: { count: number }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="lg"
      className="h-12 w-full md:w-auto md:min-w-64"
      disabled={pending}
    >
      {pending ? (
        "Saving session..."
      ) : (
        <>
          <CheckIcon data-icon="inline-start" />
          Save {count || "checked"} {count === 1 ? "exercise" : "exercises"}
        </>
      )}
    </Button>
  )
}

export function WorkoutForm({
  suggestions,
  repeatPlan,
}: {
  suggestions: WorkoutSuggestions
  repeatPlan?: RepeatWorkoutPlan | null
}) {
  const repeatGroups = useMemo(
    () =>
      repeatPlan
        ? Array.from(
            new Set(repeatPlan.exercises.map((exercise) => exercise.muscleGroup))
          )
        : [],
    [repeatPlan]
  )
  const [category, setCategory] = useState<WorkoutSessionCategory>(
    repeatPlan?.category ?? "STRENGTH"
  )
  const [performedOn, setPerformedOn] = useState(localDateString)
  const [selectedGroups, setSelectedGroups] =
    useState<MuscleGroup[]>(repeatGroups)
  const [exercises, setExercises] = useState<PlannedExercise[]>(() =>
    repeatPlan
      ? repeatPlan.exercises.map((exercise) =>
          plannedFromSuggestion(exercise, `repeat-${repeatPlan.id}`)
        )
      : []
  )
  const [state, formAction] = useActionState(
    saveWorkoutSessionAction,
    initialWorkoutSessionState
  )
  const customCounter = useRef(0)
  const strengthGroups = useRef<MuscleGroup[]>(
    repeatPlan?.category === "STRENGTH" ? repeatGroups : []
  )
  const today = performedOn || localDateString()
  const completedCount = exercises.filter((exercise) => exercise.completed).length
  const payload = JSON.stringify({
    category,
    performedOn,
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    selectedGroups,
    exercises,
  })

  useEffect(() => {
    if (!state.focusField) return
    document.getElementById(state.focusField)?.focus()
  }, [state])

  function loadGroup(group: MuscleGroup) {
    return suggestions[group].map((exercise) =>
      plannedFromSuggestion(exercise, `latest-${group}`)
    )
  }

  function chooseCategory(next: WorkoutSessionCategory) {
    if (next === category) return

    setCategory(next)
    if (next === "CARDIO") {
      strengthGroups.current = selectedGroups.filter(
        (group) => group !== "CARDIO"
      )
      setSelectedGroups(["CARDIO"])
      setExercises((items) => {
        const unchecked = items.map((exercise) =>
          exercise.muscleGroup === "CARDIO"
            ? exercise
            : { ...exercise, completed: false }
        )
        return unchecked.some((exercise) => exercise.muscleGroup === "CARDIO")
          ? unchecked
          : [...unchecked, ...loadGroup("CARDIO")]
      })
    } else {
      setSelectedGroups(strengthGroups.current)
      setExercises((items) =>
        items.map((exercise) =>
          exercise.muscleGroup === "CARDIO"
            ? { ...exercise, completed: false }
            : exercise
        )
      )
    }
  }

  function toggleGroup(group: MuscleGroup) {
    const selected = selectedGroups.includes(group)
    if (selected) {
      const nextGroups = selectedGroups.filter((item) => item !== group)
      strengthGroups.current = nextGroups
      setSelectedGroups(nextGroups)
      setExercises((items) =>
        items.map((exercise) =>
          exercise.muscleGroup === group
            ? { ...exercise, completed: false }
            : exercise
        )
      )
      return
    }

    const nextGroups = [...selectedGroups, group]
    strengthGroups.current = nextGroups
    setSelectedGroups(nextGroups)
    setExercises((items) =>
      items.some((exercise) => exercise.muscleGroup === group)
        ? items
        : [...items, ...loadGroup(group)]
    )
  }

  function addExercise(group: MuscleGroup) {
    customCounter.current += 1
    setExercises((items) => [
      ...items,
      blankExercise(group, `custom-${group}-${customCounter.current}`),
    ])
  }

  function updateExercise(
    index: number,
    changes: Partial<PlannedExercise>
  ) {
    setExercises((items) =>
      items.map((exercise, itemIndex) =>
        itemIndex === index ? { ...exercise, ...changes } : exercise
      )
    )
  }

  function changeType(index: number, type: WorkoutType) {
    updateExercise(index, {
      type,
      weightKg: null,
      reps: null,
      sets: null,
      durationMinutes: null,
      steps: null,
      calories: null,
      distanceKm: null,
    })
  }

  function removeExercise(index: number) {
    setExercises((items) => items.filter((_, itemIndex) => itemIndex !== index))
  }

  const activeGroups =
    category === "CARDIO" ? (["CARDIO"] as MuscleGroup[]) : selectedGroups

  return (
    <form action={formAction} className="atlas-form" noValidate>
      <input type="hidden" name="payload" value={payload} />

      {state.message ? (
        <Alert variant="destructive" className="mb-5">
          <AlertTitle>Session needs attention</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <section className="atlas-stage" aria-labelledby="session-path-heading">
        <div className="atlas-stage-heading">
          <span aria-hidden="true">01</span>
          <div>
            <h2 id="session-path-heading">Set today&apos;s training path</h2>
            <p>Strength zones stay together. Cardio runs on its own track.</p>
          </div>
        </div>
        <div className="atlas-stage-label" aria-hidden="true">
          GYM TRACK / TRAINING PLATE
        </div>

        <fieldset className="atlas-category">
          <legend className="sr-only">Workout category</legend>
          {(["STRENGTH", "CARDIO"] as const).map((option) => {
            const selected = category === option
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                className="atlas-category-option"
                onClick={() => chooseCategory(option)}
              >
                {option === "STRENGTH" ? <DumbbellIcon /> : <ActivityIcon />}
                <span>
                  <strong>{option === "STRENGTH" ? "Strength" : "Cardio"}</strong>
                  <small>
                    {option === "STRENGTH"
                      ? "Build a multi-zone plan"
                      : "Treadmill or cycling"}
                  </small>
                </span>
                <ChevronRightIcon className="ml-auto" />
              </button>
            )
          })}
        </fieldset>

        {category === "STRENGTH" ? (
          <fieldset
            id="training-zones"
            className="atlas-zones"
            tabIndex={state.focusField === "training-zones" ? -1 : undefined}
            aria-describedby={
              state.fieldErrors["training-zones"]
                ? "training-zones-error"
                : "training-zones-description"
            }
          >
            <legend>Choose one or more muscle zones</legend>
            <p id="training-zones-description">
              Each zone recalls the latest session where you trained it.
            </p>
            <div className="atlas-zone-plate">
              {(["FRONT", "BACK"] as const).map((view) => (
                <div key={view} className="atlas-zone-view">
                  <span className="atlas-zone-view-label">{view}</span>
                  <div className="grid grid-rows-3 gap-2">
                    {zoneLayout
                      .filter((zone) => zone.view === view)
                      .map(({ group, position }) => {
                        const selected = selectedGroups.includes(group)
                        return (
                          <button
                            key={`${view}-${group}`}
                            type="button"
                            aria-pressed={selected}
                            className={cn("atlas-zone", position)}
                            onClick={() => toggleGroup(group)}
                          >
                            <span>{muscleGroupLabels[group]}</span>
                            {selected ? <CheckIcon aria-hidden="true" /> : null}
                          </button>
                        )
                      })}
                  </div>
                </div>
              ))}
              <button
                type="button"
                aria-pressed={selectedGroups.includes("LEGS")}
                className="atlas-zone atlas-legs-zone"
                onClick={() => toggleGroup("LEGS")}
              >
                <span>Legs</span>
                {selectedGroups.includes("LEGS") ? (
                  <CheckIcon aria-hidden="true" />
                ) : null}
              </button>
            </div>
            {state.fieldErrors["training-zones"] ? (
              <FieldError id="training-zones-error">
                {state.fieldErrors["training-zones"]}
              </FieldError>
            ) : null}
          </fieldset>
        ) : (
          <div className="atlas-cardio-route">
            <ActivityIcon aria-hidden="true" />
            <div>
              <strong>Cardio route selected</strong>
              <p>
                Your most recent cardio exercises are ready below. Add another
                if today&apos;s route is different.
              </p>
            </div>
          </div>
        )}
      </section>

      <section
        id="session-plan"
        className="atlas-plan atlas-plan-enter"
        aria-labelledby="session-plan-heading"
        tabIndex={state.focusField === "session-plan" ? -1 : undefined}
      >
        <div className="atlas-stage-heading">
          <span aria-hidden="true">02</span>
          <div>
            <h2 id="session-plan-heading">Record the plan you actually finish</h2>
            <p>Check completed work and adjust the recalled values.</p>
          </div>
        </div>

        {!activeGroups.length ? (
          <div className="atlas-empty">
            <RotateCcwIcon aria-hidden="true" />
            <div>
              <strong>No training zones selected</strong>
              <p>Choose a zone above to reveal its latest routine.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {activeGroups.map((group) => {
              const groupExercises = exercises
                .map((exercise, index) => ({ exercise, index }))
                .filter(({ exercise }) => exercise.muscleGroup === group)

              return (
                <section
                  key={group}
                  className="atlas-group-reveal"
                  aria-labelledby={`group-${group}`}
                >
                  <div className="atlas-group-heading">
                    <div>
                      <span>{group === "CARDIO" ? "ROUTE" : "MUSCLE ZONE"}</span>
                      <h3 id={`group-${group}`}>{muscleGroupLabels[group]}</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addExercise(group)}
                    >
                      <PlusIcon data-icon="inline-start" />
                      Add exercise
                    </Button>
                  </div>

                  {groupExercises.length ? (
                    <div className="atlas-exercise-stack">
                      {groupExercises.map(({ exercise, index }) => {
                        const nameId = `exercise-${index}-name`
                        const nameError = state.fieldErrors[nameId]
                        const resistance =
                          exercise.type === "STRENGTH" ||
                          exercise.type === "BODYWEIGHT"
                        const cardio =
                          exercise.type === "TREADMILL" ||
                          exercise.type === "CYCLING"

                        return (
                          <article
                            key={exercise.clientId}
                            className={cn(
                              "atlas-exercise",
                              exercise.completed && "is-complete"
                            )}
                          >
                            <label className="atlas-check">
                              <input
                                type="checkbox"
                                checked={exercise.completed}
                                onChange={(event) =>
                                  updateExercise(index, {
                                    completed: event.target.checked,
                                  })
                                }
                              />
                              <span aria-hidden="true">
                                {exercise.completed ? <CheckIcon /> : null}
                              </span>
                              <span className="sr-only">
                                Mark {exercise.name || "exercise"} completed
                              </span>
                            </label>

                            <div className="atlas-exercise-body">
                              <div className="atlas-exercise-identity">
                                <label>
                                  <span>Exercise</span>
                                  <Input
                                    id={nameId}
                                    value={exercise.name}
                                    placeholder={
                                      group === "CARDIO"
                                        ? "Cardio exercise"
                                        : `${muscleGroupLabels[group]} exercise`
                                    }
                                    required={exercise.completed}
                                    aria-invalid={Boolean(nameError)}
                                    aria-describedby={
                                      nameError ? `${nameId}-error` : undefined
                                    }
                                    onChange={(event) =>
                                      updateExercise(index, {
                                        name: event.target.value,
                                      })
                                    }
                                  />
                                  {nameError ? (
                                    <FieldError id={`${nameId}-error`}>
                                      {nameError}
                                    </FieldError>
                                  ) : null}
                                </label>
                                <label>
                                  <span>Metric model</span>
                                  <select
                                    id={`exercise-${index}-type`}
                                    className="atlas-select"
                                    value={exercise.type}
                                    onChange={(event) =>
                                      changeType(
                                        index,
                                        event.target.value as WorkoutType
                                      )
                                    }
                                  >
                                    {group === "CARDIO" ? (
                                      <>
                                        <option value="TREADMILL">
                                          Treadmill
                                        </option>
                                        <option value="CYCLING">Cycling</option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="STRENGTH">Weighted</option>
                                        <option value="BODYWEIGHT">
                                          Bodyweight
                                        </option>
                                      </>
                                    )}
                                  </select>
                                </label>
                              </div>

                              <div className="atlas-metrics">
                                {exercise.type === "STRENGTH" ? (
                                  <NumericField
                                    id={`exercise-${index}-weightKg`}
                                    label="Weight (kg)"
                                    value={exercise.weightKg}
                                    min={0.1}
                                    max={1000}
                                    step={0.1}
                                    required={exercise.completed}
                                    error={
                                      state.fieldErrors[
                                        `exercise-${index}-weightKg`
                                      ]
                                    }
                                    onChange={(weightKg) =>
                                      updateExercise(index, { weightKg })
                                    }
                                  />
                                ) : null}
                                {resistance ? (
                                  <>
                                    <NumericField
                                      id={`exercise-${index}-reps`}
                                      label="Reps"
                                      value={exercise.reps}
                                      min={1}
                                      max={10000}
                                      required={exercise.completed}
                                      error={
                                        state.fieldErrors[
                                          `exercise-${index}-reps`
                                        ]
                                      }
                                      onChange={(reps) =>
                                        updateExercise(index, { reps })
                                      }
                                    />
                                    <NumericField
                                      id={`exercise-${index}-sets`}
                                      label="Sets"
                                      value={exercise.sets}
                                      min={1}
                                      max={1000}
                                      required={exercise.completed}
                                      error={
                                        state.fieldErrors[
                                          `exercise-${index}-sets`
                                        ]
                                      }
                                      onChange={(sets) =>
                                        updateExercise(index, { sets })
                                      }
                                    />
                                  </>
                                ) : null}
                                {cardio ? (
                                  <>
                                    <NumericField
                                      id={`exercise-${index}-durationMinutes`}
                                      label="Minutes"
                                      value={exercise.durationMinutes}
                                      min={0.1}
                                      max={1440}
                                      step={0.1}
                                      required={exercise.completed}
                                      error={
                                        state.fieldErrors[
                                          `exercise-${index}-durationMinutes`
                                        ]
                                      }
                                      onChange={(durationMinutes) =>
                                        updateExercise(index, {
                                          durationMinutes,
                                        })
                                      }
                                    />
                                    <NumericField
                                      id={`exercise-${index}-distanceKm`}
                                      label="Distance (km)"
                                      value={exercise.distanceKm}
                                      min={0.01}
                                      max={1000}
                                      step={0.01}
                                      required={exercise.completed}
                                      error={
                                        state.fieldErrors[
                                          `exercise-${index}-distanceKm`
                                        ]
                                      }
                                      onChange={(distanceKm) =>
                                        updateExercise(index, { distanceKm })
                                      }
                                    />
                                    <NumericField
                                      id={`exercise-${index}-calories`}
                                      label="Calories"
                                      value={exercise.calories}
                                      min={0}
                                      max={20000}
                                      required={exercise.completed}
                                      error={
                                        state.fieldErrors[
                                          `exercise-${index}-calories`
                                        ]
                                      }
                                      onChange={(calories) =>
                                        updateExercise(index, { calories })
                                      }
                                    />
                                    {exercise.type === "TREADMILL" ? (
                                      <NumericField
                                        id={`exercise-${index}-steps`}
                                        label="Steps"
                                        value={exercise.steps}
                                        min={0}
                                        max={200000}
                                        required={exercise.completed}
                                        error={
                                          state.fieldErrors[
                                            `exercise-${index}-steps`
                                          ]
                                        }
                                        onChange={(steps) =>
                                          updateExercise(index, { steps })
                                        }
                                      />
                                    ) : null}
                                  </>
                                ) : null}
                              </div>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              className="atlas-remove"
                              onClick={() => removeExercise(index)}
                            >
                              <Trash2Icon data-icon="inline-start" />
                              Remove
                            </Button>
                            <span className="atlas-type-note">
                              {exercise.sourcePerformedOn
                                ? `Last ${new Intl.DateTimeFormat("en", {
                                    month: "short",
                                    day: "numeric",
                                    timeZone: "UTC",
                                  }).format(
                                    new Date(
                                      `${exercise.sourcePerformedOn}T12:00:00Z`
                                    )
                                  )}`
                                : `Custom · ${exerciseTypeLabel(exercise.type)}`}
                            </span>
                          </article>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="atlas-empty is-inline">
                      <PlusIcon aria-hidden="true" />
                      <div>
                        <strong>No previous {muscleGroupLabels[group]} plan</strong>
                        <p>
                          Add the first exercise for this zone. It will become
                          your starting point next time.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addExercise(group)}
                      >
                        Add an exercise
                      </Button>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}
        {state.fieldErrors["session-plan"] ? (
          <FieldError className="mt-4">
            {state.fieldErrors["session-plan"]}
          </FieldError>
        ) : null}
      </section>

      <div className="atlas-save-dock">
        <label className="atlas-date">
          <span>Session date</span>
          <Input
            id="performedOn"
            type="date"
            max={today}
            value={performedOn}
            suppressHydrationWarning
            aria-invalid={Boolean(state.fieldErrors.performedOn)}
            aria-describedby={
              state.fieldErrors.performedOn ? "performedOn-error" : undefined
            }
            onChange={(event) => setPerformedOn(event.target.value)}
          />
          {state.fieldErrors.performedOn ? (
            <FieldError id="performedOn-error">
              {state.fieldErrors.performedOn}
            </FieldError>
          ) : null}
        </label>
        <div className="atlas-save-summary" aria-live="polite">
          <strong>{completedCount}</strong>
          <span>{completedCount === 1 ? "exercise ready" : "exercises ready"}</span>
        </div>
        <span className="sr-only" aria-live="polite">
          {completedCount}{" "}
          {completedCount === 1 ? "exercise is" : "exercises are"} ready to save
        </span>
        <SessionSubmit count={completedCount} />
      </div>
    </form>
  )
}
