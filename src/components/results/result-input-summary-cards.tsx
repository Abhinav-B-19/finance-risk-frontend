import { formatCurrency } from "@/lib/history-chart-utils";

interface ResultInputSummaryCardsProps {
  income: number;
  expenses: number;
  debt: number;
}

const ResultInputSummaryCards = ({
  income,
  expenses,
  debt,
}: ResultInputSummaryCardsProps) => {
  const cards = [
    {
      label: "Monthly Income",
      value: formatCurrency(income),
      description: "Income entered for this prediction",
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(expenses),
      description: "Expenses entered for this prediction",
    },
    {
      label: "Total Debt",
      value: formatCurrency(debt),
      description: "Debt entered for this prediction",
    },
  ];

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-3xl font-bold">
          Input Summary
        </h2>

        <p className="mt-2 text-gray-600">
          Financial details used for this prediction.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-gray-50 p-6"
          >
            <p className="text-sm text-gray-500">
              {card.label}
            </p>

            <p className="mt-3 text-3xl font-bold">
              {card.value}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResultInputSummaryCards;