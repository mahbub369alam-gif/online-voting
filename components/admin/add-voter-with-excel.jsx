"use client";

import { generateVoterId } from "@/lib/utils";
import {
  Check,
  CircleCheckBig,
  File,
  HardDriveUpload,
  LoaderCircle,
  Pencil,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function AddVoterWithExcel() {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleUpload = () => {
    inputRef.current.click();
  };

  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // প্রথম শীট থেকে ডাটা নেয়া
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Sheet কে JSON এ কনভার্ট
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length > 0) {
        jsonData.forEach((voter) => {
          voter.id = generateVoterId();
          voter.isUploaded = false;
          voter.apiResponse = null;
          voter.isLoading = false;
        });
        setData(jsonData);
        setOpen(true);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDelete = (voterId) => {
    setData((prevData) => prevData.filter((voter) => voter.id !== voterId));
  };

  const handleUpdate = (updatedVoter) => {
    setData((prevData) =>
      prevData.map((voter) =>
        voter.id === updatedVoter.id ? { ...voter, ...updatedVoter } : voter
      )
    );
  };

  const handleAddNewRecord = () => {
    setData((prevData) => [
      ...prevData,
      {
        id: generateVoterId(),
        name: "",
        email: "",
        phone: "",
        nid: "",
        isUploaded: false,
        apiResponse: null,
        isLoading: false,
      },
    ]);
  };

  const handleSaveVoters = async (voterToSave) => {
    try {
      if (voterToSave.isLoading || voterToSave.isUploaded) return;
      setData((prevData) =>
        prevData.map((voter) =>
          voter.id === voterToSave.id ? { ...voter, isLoading: true } : voter
        )
      );

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", voterToSave.name || "");
      submitData.append("email", voterToSave.email || "");
      submitData.append("phoneNumber", voterToSave.phone || "");
      submitData.append("nidNumber", voterToSave.nid || "");
      submitData.append("voterId", voterToSave.id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/voters`,
        {
          method: "POST",
          body: submitData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setData((prevData) =>
          prevData.map((voter) =>
            voter.id === voterToSave.id
              ? {
                  ...voter,
                  ...voterToSave,
                  isUploaded: false,
                  apiResponse: errorData.error,
                }
              : voter
          )
        );
        return;
      }

      const newVoter = await response.json();

      setData((prevData) =>
        prevData.map((voter) =>
          voter.id === voterToSave.id
            ? {
                ...voter,
                ...voterToSave,
                isUploaded: true,
                apiResponse: "success",
              }
            : voter
        )
      );
    } catch (error) {
      setData((prevData) =>
        prevData.map((voter) =>
          voter.id === voterToSave.id
            ? {
                ...voter,
                ...voterToSave,
                isUploaded: false,
                apiResponse: error,
              }
            : voter
        )
      );
    } finally {
      setData((prevData) =>
        prevData.map((voter) =>
          voter.id === voterToSave.id ? { ...voter, isLoading: false } : voter
        )
      );
    }
  };

  const handleSaveAllVoters = async () => {
    for (const voter of data) {
      await handleSaveVoters(voter);
    }
  };

  // if all voters are uploaded, close the dialog and reload the page
  useEffect(() => {
    if (!open) return;
    const isUploadedAll = data.every((voter) => voter.isUploaded);
    if (isUploadedAll) {
      setOpen(false);
      window.location.reload();
    }
  }, [data, open]);

  return (
    <>
      <Button onClick={handleUpload}>
        <File className="mr-2 h-4 w-4" />
        Upload excel file
      </Button>
      <input
        type="file"
        className="hidden"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        ref={inputRef}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl!">
          <DialogHeader>
            <DialogTitle>Add Voter with Excel</DialogTitle>
            <DialogDescription className="flex justify-between">
              Create multiple voter accounts. The voters will receive their
              login credentials and voter ID.
              <Button onClick={handleAddNewRecord}>
                <Plus />
                Add A New Record
              </Button>
            </DialogDescription>
          </DialogHeader>
          {data.length > 0 ? (
            <div className="overflow-y-auto max-h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sl</TableHead>
                    <TableHead className="pl-5!">Name</TableHead>
                    <TableHead className="pl-5!">Email</TableHead>
                    <TableHead className="pl-5!">Phone</TableHead>
                    <TableHead className="pl-6!">NID</TableHead>
                    <TableHead className="pl-5!">VoterId</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((voter, index) => (
                    <SingleVoter
                      key={voter.id}
                      voter={voter}
                      index={index}
                      handleDelete={handleDelete}
                      handleUpdate={handleUpdate}
                      handleSaveVoters={handleSaveVoters}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-2xl py-6">No data available</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setData([]);
                inputRef.current.value = "";
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAllVoters}>Save Voters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SingleVoter({
  voter,
  index,
  handleDelete,
  handleUpdate,
  handleSaveVoters,
}) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [updatedVoter, setUpdatedVoter] = useState(voter);

  const handleUpdateVoter = () => {
    if (isUpdate) {
      handleUpdate(updatedVoter);
    }
    setIsUpdate(!isUpdate);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setUpdatedVoter({ ...updatedVoter, [name]: value });
  };

  return (
    <TableRow key={voter.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell className="font-medium">
        <Input
          className="disabled:text-black"
          name="name"
          disabled={!isUpdate}
          value={updatedVoter.name || (!isUpdate ? "N/A" : "")}
          onChange={handleChangeInput}
        />
        {voter.apiResponse === "success" && (
          <span className="flex items-center justify-center gap-1">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-green-500 text-xs">
              Voter Added Successfully
            </span>
          </span>
        )}
        {voter.apiResponse && voter.apiResponse !== "success" && (
          <span className="flex items-center justify-center gap-1">
            <X className="h-4 w-4 text-red-500" />
            <span className="text-red-500 text-xs">{voter.apiResponse}</span>
          </span>
        )}
      </TableCell>
      <TableCell>
        <Input
          className="disabled:text-black"
          name="email"
          disabled={!isUpdate}
          value={updatedVoter.email || (!isUpdate ? "N/A" : "")}
          onChange={handleChangeInput}
        />
      </TableCell>
      <TableCell>
        <Input
          className="disabled:text-black"
          name="phone"
          disabled={!isUpdate}
          value={updatedVoter.phone || (!isUpdate ? "N/A" : "")}
          onChange={handleChangeInput}
        />
      </TableCell>
      <TableCell>
        <Input
          className="disabled:text-black"
          name="nid"
          disabled={!isUpdate}
          value={updatedVoter.nid || (!isUpdate ? "N/A" : "")}
          onChange={handleChangeInput}
        />
      </TableCell>
      <TableCell>
        <Input
          className="disabled:text-black"
          name="id"
          disabled={!isUpdate}
          value={updatedVoter.id || (!isUpdate ? "N/A" : "")}
          onChange={handleChangeInput}
        />
      </TableCell>
      <TableCell className="text-right overflow-visible flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-gray-600 hover:text-white text-gray-600 border border-gray-600 rounded-full"
          onClick={handleUpdateVoter}
        >
          {isUpdate ? <Check /> : <Pencil />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-red-600 hover:text-white text-red-600 border border-red-600 rounded-full"
          onClick={() => handleDelete(voter.id)}
        >
          <Trash />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-teal-600 hover:text-white text-teal-600 border border-teal-600 rounded-full"
          onClick={() => handleSaveVoters(voter)}
          disabled={voter.isUploaded || voter.isLoading}
        >
          {voter.isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : voter.isUploaded ? (
            <CircleCheckBig />
          ) : (
            <HardDriveUpload />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}
