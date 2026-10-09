import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PiCaretDownBold,
  PiInfoDuotone,
  PiCloudArrowUpDuotone,
} from "react-icons/pi";
import Field from "./Field";
import { fieldAria } from "../../lib/fieldAria";
import {
  SubmitButton,
  SubmitError,
  MobileInput,
} from "./FormParts";
import VideoInput from "./VideoInput";
import { EMPTY_VIDEO } from "../../lib/video";
import { participantSchema } from "../../lib/schemas";
import {
  CATEGORIES,
  DISCLAIMER,
  EVENT,
} from "../../data/event";
import participantFormStore from "../../zustand/Store/participantFormStore";

export default function ParticipantForm({ onSuccess }) {
  const [submitError, setSubmitError] = useState("");
  const registerParticipant = participantFormStore(
    (state) => state.registerParticipant
  );
  const loading = participantFormStore(
    (state) => state.loading
  );
  const storeError = participantFormStore(
    (state) => state.error
  );
  const [uploadProgress, setUploadProgress] =
    useState(null);
  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(participantSchema),

    mode: "onTouched",

    defaultValues: {
      name: "",
      age: "",
      phone: "",
      email: "",
      category: "",
      video: EMPTY_VIDEO,
      consent: false,
    },
  });

  const onSubmit = async (values) => {
    setSubmitError("");
    setUploadProgress(0);

    try {
      const { video, ...fields } = values;

      const formData = new FormData();

      formData.append("fullName", fields.name?.trim() || "");
      formData.append("email", fields.email?.trim().toLowerCase() || "");
      formData.append("phone", fields.phone?.trim() || "");
      formData.append("age", String(fields.age || ""));
      formData.append("gender", "");
      formData.append("city", "");
      formData.append("talentCategory", fields.category || "");
      formData.append("performanceTitle", "");
      formData.append("performanceDuration", "");
      formData.append(
        "consent",
        fields.consent ? "true" : "false"
      );

      if (
        !video?.file ||
        !(video.file instanceof File)
      ) {
        throw new Error("Please select a performance video.");
      }

      formData.append(
        "video",
        video.file,
        video.file.name
      );
      console.log("Sending participant registration:");

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(key, value);
        }
      }

      const response = await registerParticipant(
        formData,
        {
          onProgress: (percent) => {
            setUploadProgress(percent);
          },
        }
      );

      console.log(
        "Participant registration successful:",
        response
      );

      const category = CATEGORIES.find(
        (item) => item.id === values.category
      );

      onSuccess?.({
        type: "participant",
        name: values.name,
        category: category?.name || values.category,
        registration: response,
      });

    } catch (error) {
      console.error(
        "Participant registration failed:",
        error
      );

      const message = "Unable to register participant. Please try again.";

      setSubmitError(message);

    } finally {
      setUploadProgress(null);
    }
  };


  const submitting =
    isSubmitting || loading;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      {/* Full Name */}
      <Field
        id="p-name"
        label="Full name"
        error={errors.name?.message}
      >
        <input
          id="p-name"
          type="text"
          autoComplete="name"
          placeholder="As you’d like it announced"
          className="field-input"
          {...fieldAria(
            "p-name",
            errors.name
          )}
          {...register("name")}
        />
      </Field>

      {/* Age + phone */}
      <div className="grid gap-5 sm:grid-cols-[0.6fr_1.4fr]">
        <Field
          id="p-age"
          label="Age"
          error={errors.age?.message}
          hint={`${EVENT.minAge}+ only`}
        >
          <input
            id="p-age"
            type="number"
            inputMode="numeric"
            min={EVENT.minAge}
            max={100}
            placeholder="Years"
            className="field-input"
            {...fieldAria(
              "p-age",
              errors.age,
              true
            )}
            {...register("age")}
          />
        </Field>

        <Field
          id="p-phone"
          label="Phone number"
          error={errors.phone?.message}
        >
          <MobileInput
            id="p-phone"
            {...fieldAria(
              "p-phone",
              errors.phone
            )}
            {...register("phone")}
          />
        </Field>
      </div>

      {/* Email */}
      <Field
        id="p-email"
        label="Email address"
        error={errors.email?.message}
      >
        <input
          id="p-email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="field-input"
          {...fieldAria(
            "p-email",
            errors.email
          )}
          {...register("email")}
        />
      </Field>

      {/* Category */}
      <Field
        id="p-category"
        label="Category"
        error={errors.category?.message}
        hint="Solo performances only"
      >
        <div className="relative">
          <select
            id="p-category"
            className="field-input appearance-none pr-12"
            {...fieldAria(
              "p-category",
              errors.category,
              true
            )}
            {...register("category")}
          >
            <option value="" disabled>
              Choose a category
            </option>

            {CATEGORIES.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name} (solo)
              </option>
            ))}
          </select>

          <PiCaretDownBold
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-slate"
            aria-hidden="true"
          />
        </div>
      </Field>

      {/* Video */}
      <Controller
        name="video"
        control={control}
        render={({ field }) => (
          <VideoInput
            id="p-video"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.video?.message}
          />
        )}
      />

      {/* Disclaimer */}
      <div className="rounded-2xl bg-mist p-4 sm:p-5">
        <p className="flex items-center gap-2 font-display text-lg font-bold">
          <PiInfoDuotone
            className="size-5 text-iris"
            aria-hidden="true"
          />

          Disclaimer
        </p>

        <p className="mt-2 text-sm leading-relaxed text-slate">
          {DISCLAIMER}
        </p>

        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            id="p-consent"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-orange"
            aria-invalid={
              errors.consent
                ? "true"
                : "false"
            }
            aria-describedby={
              errors.consent
                ? "p-consent-error"
                : undefined
            }
            {...register("consent")}
          />

          <span className="text-[0.95rem] font-semibold">
            I am {EVENT.minAge} or older, I have
            read the disclaimer above and I agree
            to it.
          </span>
        </label>

        {errors.consent && (
          <p
            id="p-consent-error"
            className="field-error"
            role="alert"
          >
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* API Error */}
      <SubmitError
        message={
          submitError ||
          (!loading ? storeError : "")
        }
      />

      {/* Submit */}
      <SubmitButton
        submitting={submitting}
      >
        {loading
          ? uploadProgress !== null &&
            uploadProgress < 100
            ? `Uploading video... ${uploadProgress}%`
            : "Submitting registration..."
          : "Submit my registration"}
      </SubmitButton>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress !== null && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{
              opacity: 0,
              y: -6,
              height: 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-[linear-gradient(140deg,#20245E,#10133D)] p-4 text-white shadow-[0_20px_40px_-24px_rgba(16,19,61,0.8)]">
              <p className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-flex"
                  >
                    <PiCloudArrowUpDuotone
                      className="size-5 text-orange"
                      aria-hidden="true"
                    />
                  </motion.span>

                  {uploadProgress < 100
                    ? "Uploading your video"
                    : "Finishing up"}
                </span>

                <span className="font-display text-lg tabular-nums">
                  {uploadProgress}%
                </span>
              </p>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="relative h-full overflow-hidden rounded-full bg-[linear-gradient(90deg,#E76417,#F59E5B)]"
                  animate={{
                    width: `${uploadProgress}%`,
                  }}
                  transition={{
                    ease: "easeOut",
                    duration: 0.3,
                  }}
                >
                  <motion.span
                    className="absolute inset-y-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
                    animate={{
                      x: [
                        "-100%",
                        "250%",
                      ],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>

              <p className="mt-2 text-xs text-white/60">
                Keep this page open until the
                upload finishes.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closing Date */}
      <p className="text-center text-sm text-slate">
        Registrations and auditions close on{" "}
        {EVENT.registrationCloseLabel}.
      </p>
    </form>
  );
}