import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiTicketDuotone } from "react-icons/pi";

import Field from "./Field";
import { fieldAria } from "../../lib/fieldAria";
import {
  SubmitButton,
  SubmitError,
  MobileInput,
} from "./FormParts";

import { attendeeSchema } from "../../lib/schemas";
import { ATTENDEE_NOTE, EVENT } from "../../data/event";
import attendFormStore from "../../zustand/Store/attendFormStore";

export default function AttendeeForm({ onSuccess }) {
  const [submitError, setSubmitError] = useState("");

  const registerAttendee = attendFormStore(
    (state) => state.registerAttendee
  );

  const loading = attendFormStore((state) => state.loading);
  const storeError = attendFormStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(attendeeSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      consent: false,
    },
  });

  const onSubmit = async (values) => {
    setSubmitError("");

    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim().toLowerCase(),
      consent: values.consent,
    };

    console.log("Submitting attendee registration:", payload);

    try {
      const response = await registerAttendee(payload);

      if (!response?.success) {
        throw new Error(
          response?.message || "Registration failed."
        );
      }

      reset();

      onSuccess?.({
        type: "attendee",
        name: payload.name,
        registration: response.data,
      });
    } catch (error) {
      console.error("Attendee registration failed:", error);

      setSubmitError("Unable to register. Please try again.");
    }
  };

  const onInvalid = (validationErrors) => {
    console.error(
      "Form validation failed:",
      validationErrors
    );
  };

  const submitting = isSubmitting || loading;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="space-y-5"
    >
      <div className="flex gap-3 rounded-2xl bg-orange/8 p-4 ring-1 ring-orange/25">
        <PiTicketDuotone
          className="mt-0.5 size-6 shrink-0 text-orange"
          aria-hidden="true"
        />

        <p className="text-[0.95rem] font-semibold text-navy">
          {ATTENDEE_NOTE}
        </p>
      </div>

      <Field
        id="a-name"
        label="Full name"
        error={errors.name?.message}
      >
        <input
          id="a-name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          className="field-input"
          {...register("name")}
          {...fieldAria("a-name", errors.name)}
        />
      </Field>

      <Field
        id="a-phone"
        label="Phone number"
        error={errors.phone?.message}
      >
        <MobileInput
          id="a-phone"
          {...register("phone")}
          {...fieldAria("a-phone", errors.phone)}
        />
      </Field>

      <Field
        id="a-email"
        label="Email address"
        error={errors.email?.message}
      >
        <input
          id="a-email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="field-input"
          {...register("email")}
          {...fieldAria("a-email", errors.email)}
        />
      </Field>

      <div>
        <label
          htmlFor="a-consent"
          className="flex cursor-pointer items-start gap-3 rounded-2xl bg-mist p-4"
        >
          <input
            id="a-consent"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-orange"
            aria-invalid={errors.consent ? "true" : "false"}
            aria-describedby={
              errors.consent
                ? "a-consent-error"
                : undefined
            }
            {...register("consent")}
          />

          <span className="text-[0.95rem] font-semibold text-navy">
            I understand that entry is strictly by invitation
            only, and that this registration is a request for
            an invitation.
          </span>
        </label>

        {errors.consent && (
          <p
            id="a-consent-error"
            className="field-error"
            role="alert"
          >
            {errors.consent.message}
          </p>
        )}
      </div>

      <SubmitError message={submitError || storeError} />

      <SubmitButton submitting={submitting}>
        {submitting
          ? "Requesting invitation..."
          : "Request my invitation"}
      </SubmitButton>

      <p className="text-center text-sm text-slate">
        Event date: {EVENT.eventDateLabel}
      </p>
    </form>
  );
}
