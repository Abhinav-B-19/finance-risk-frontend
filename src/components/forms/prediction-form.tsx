"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import PageContainer from "@/components/layout/page-container";
import { createPrediction } from "@/services/prediction-service";
import { PredictionRequest } from "@/types/prediction";

import axios from "axios";
import { toast } from "sonner";

const PredictionForm = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PredictionRequest>();

  const onSubmit = async (data: PredictionRequest) => {
    try {
      setIsSubmitting(true);

      const response = await createPrediction(data);

      toast.success("Prediction generated successfully", {
        duration: 4000,
        style: {
          background: "#16a34a",
          color: "white",
          border: "none",
        },
      });

      console.log(response);

      reset();

      router.push(`/results/${response.predictionId}`);
    } catch (error) {
        console.error(error);
      
        let errorMessage =
          "Something went wrong while generating prediction";
      
        if (axios.isAxiosError(error)) {
            const backendMessage = error.response?.data?.message;
            if (
                backendMessage &&
                !backendMessage.includes("<!DOCTYPE")
            ) {
                errorMessage = backendMessage;
            } else {
                errorMessage =
                "Prediction service is temporarily unavailable";
            }
        }
      
        toast.error(errorMessage, {
          duration: 5000,
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Risk Prediction
          </h1>

          <p className="mt-2 text-gray-600">
            Enter your financial details to forecast future risk.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />

            {errors.name && (
              <p className="mt-2 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Income
            </label>

            <input
              type="number"
              {...register("income", {
                required: "Income is required",
                min: {
                    value: 1,
                    message: "Income must be greater than 0",
                },
                valueAsNumber: true,
              })}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />

            {errors.income && (
              <p className="mt-2 text-sm text-red-500">
                {errors.income.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Expenses
            </label>

            <input
              type="number"
              {...register("expenses", {
                required: "Expenses are required",
                min: {
                    value: 0,
                    message: "Expenses cannot be negative",
                },
                valueAsNumber: true,
              })}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />

            {errors.expenses && (
              <p className="mt-2 text-sm text-red-500">
                {errors.expenses.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Debt
            </label>

            <input
              type="number"
              {...register("debt", {
                required: "Debt is required",
                min: {
                    value: 0,
                    message: "Debt cannot be negative",
                },
                valueAsNumber: true,
              })}
              className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
            />

            {errors.debt && (
              <p className="mt-2 text-sm text-red-500">
                {errors.debt.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Generating Prediction..."
              : "Generate Prediction"}
          </button>
        </form>
      </div>
    </PageContainer>
  );
};

export default PredictionForm;