import { CandidateListing } from "@/components/admin/candidate-listing";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const responseCategories = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/categories`,
    { cache: "no-store" }
  );
  const categories = await responseCategories.json();

  const responseCandidates = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/candidates`,
    { cache: "no-store" }
  );
  const candidates = await responseCandidates.json();

  return <CandidateListing categories={categories} candidates={candidates} />;
}
