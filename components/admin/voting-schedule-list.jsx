"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

export function VotingSchedule({ data }) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Content Card */}
      <Card className="shadow-none">
        <CardContent>
          <div className="mb-12">
            {/* Position Title with Add Candidate Button */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Election List
              </h2>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((election) => (
                <Card
                  key={election.id}
                  className="bg-teal-100 border-teal-200 hover:bg-teal-200 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {election.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {election.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 bg-teal-500 hover:bg-teal-600 text-white rounded-full"
                          onClick={() => handleCandidateEdit(candidate.id)}
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                          onClick={() => handleCandidateDelete(candidate.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Show message if no categories */}
          {data.length === 0 && (
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
