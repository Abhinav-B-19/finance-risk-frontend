"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  predictionSchema,
  PredictionSchemaType,
} from "@/validations/prediction-schema";

import { createPrediction } from "@/services/prediction-service";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import PageContainer from "@/components/layout/page-container";

const PredictionForm = () => {
  const router = useRouter();

  const form = useForm<PredictionSchemaType>({
    resolver: zodResolver(
      predictionSchema
    ),

    defaultValues: {
      name: "",
      email: "",
      income: undefined,
      expenses: undefined,
      debt: undefined,
    },
  });

  const isSubmitting =
    form.formState.isSubmitting;

  const onSubmit = async (
    data: PredictionSchemaType
  ) => {
    try {
      const response =
        await createPrediction(data);

      localStorage.setItem(
        "userKey",
        response.userKey
      );

      toast.success(
        "Prediction generated successfully",
        {
          duration: 3000,

          style: {
            background: "#16a34a",
            color: "white",
            border: "none",
          },
        }
      );

      router.prefetch(
        `/results/${response.predictionId}`
      );

      router.push(
        `/results/${response.predictionId}`
      );
    } catch (error: any) {
      console.error(error);

      let errorMessage =
        "Prediction service temporarily unavailable";

      const backendMessage =
        error.response?.data?.message;

      if (
        backendMessage &&
        !backendMessage.includes(
          "<!DOCTYPE"
        )
      ) {
        errorMessage =
          backendMessage;
      }

      toast.error(errorMessage, {
        duration: 5000,

        style: {
          background: "#dc2626",
          color: "white",
          border: "none",
        },
      });
    }
  };

  return (
    <PageContainer>
      <div className="py-2 sm:py-4 lg:py-2">
        <div className="mx-auto w-full max-w-4xl">
          
          {/* Heading */}
          <div className="mb-6 text-center lg:mb-5">
            <h2 className="text-3xl font-bold leading-tight lg:text-5xl">
              Financial Risk Prediction
            </h2>

            <p className="mt-2 text-sm text-gray-500 md:text-base">
              Enter your financial details
              to generate AI-powered
              risk forecasts.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit
              )}
              className="space-y-4 lg:space-y-3"
            >
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({
                  field,
                }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Full Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        disabled={
                          isSubmitting
                        }
                        className="h-12 rounded-2xl text-base"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({
                  field,
                }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        disabled={
                          isSubmitting
                        }
                        className="h-12 rounded-2xl text-base"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Income */}
              <FormField
                control={form.control}
                name="income"
                render={({
                  field,
                }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Monthly Income
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        disabled={
                          isSubmitting
                        }
                        className="h-12 rounded-2xl text-base"
                        {...field}
                        value={
                          field.value ??
                          ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expenses */}
              <FormField
                control={form.control}
                name="expenses"
                render={({
                  field,
                }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Monthly Expenses
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25000"
                        disabled={
                          isSubmitting
                        }
                        className="h-12 rounded-2xl text-base"
                        {...field}
                        value={
                          field.value ??
                          ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Debt */}
              <FormField
                control={form.control}
                name="debt"
                render={({
                  field,
                }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Total Debt
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        disabled={
                          isSubmitting
                        }
                        className="h-12 rounded-2xl text-base"
                        {...field}
                        value={
                          field.value ??
                          ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            Number(
                              e.target.value
                            )
                          )
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl bg-black text-base font-semibold text-white transition hover:bg-gray-900"
              >
                {isSubmitting
                  ? "Generating Prediction..."
                  : "Generate Prediction"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default PredictionForm;