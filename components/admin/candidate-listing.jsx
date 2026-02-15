"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, User } from "lucide-react";
import { AddCandidateModal } from "./add-candidate-modal";
import { AddCategoryModal } from "./add-category-modal";
import { EditCandidateModal } from "./edit-candidate-modal";
import { EditCategoryModal } from "./edit-category-modal";

export function CandidateListing({ categories = [], candidates = [] }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!candidates || !categories) return <div>Loading...</div>;

  // Group candidates by position using categories
  const candidatesByPosition = categories.reduce((acc, category) => {
    acc[category.id] = {
      category,
      candidates: candidates.filter(
        (candidate) => candidate.categoryId === category.id
      ),
    };
    return acc;
  }, {});

  const handleCategoryDelete = async (categoryId) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await fetch(`${BASE_URL}/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      window.location.reload();
    }
  };

  const handleCandidateDelete = async (candidateId) => {
    if (confirm("Are you sure you want to delete this candidate?")) {
      await fetch(`${BASE_URL}/admin/candidates/${candidateId}`, {
        method: "DELETE",
      });
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Total Candidate List
        </h1>
        <AddCategoryModal />
      </div>

      {/* Main Content Card */}
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          {Object.entries(candidatesByPosition).map(
            ([position, { category, candidates }]) => (
              <div key={position} className="mb-12">
                {/* Position Title with Add Candidate Button */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {category.displayName}
                    <span className="text-red-500">*</span> : {category.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <AddCandidateModal
                      categories={categories}
                      categoryId={category.id}
                    />
                    <EditCategoryModal category={category} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 bg-red-500/90 hover:bg-red-500 text-white rounded-full"
                      onClick={() => handleCategoryDelete(category.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Candidates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidates.map((candidate, index) => (
                    <Card
                      key={candidate.id}
                      className="bg-teal-100 border-teal-200 hover:bg-teal-200 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={candidate.imageUrl}
                                alt={candidate.name}
                              />
                              <AvatarFallback className="bg-blue-500 text-white">
                                <User className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {candidate.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                ID :{" "}
                                {candidate.candidateId ||
                                  `0000${candidate.id}`.slice(-8)}
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <EditCandidateModal
                              candidate={candidate}
                              categories={categories}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                              onClick={() =>
                                handleCandidateDelete(candidate.id)
                              }
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Show message if no candidates in this category */}
                {candidates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No candidates in this category yet.</p>
                    <p className="text-sm">
                      Click "Add New Candidate" to add the first candidate.
                    </p>
                  </div>
                )}
              </div>
            )
          )}

          {/* Show message if no categories */}
          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No categories created yet.</p>
              <p>
                Click "ADD New Category" to create your first candidate
                category.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
