import ResultsDashboard from "@/components/dashboard/results-dashboard";

interface ResultsPageProps {
  params: Promise<{
    predictionId: string;
  }>;
}

const ResultsPage = async ({
  params,
}: ResultsPageProps) => {
  const { predictionId } = await params;

  return (
    <section className="py-0">
      <ResultsDashboard
        predictionId={predictionId}
      />
    </section>
  );
};

export default ResultsPage;