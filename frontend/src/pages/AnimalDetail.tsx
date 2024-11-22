import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchFamilyByUrl } from "@/utils/fetchFamily";
import { Animal } from "@/models/Animal";

const AnimalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimal = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const response = await axios.get<Animal>(
        `http://localhost:8000/api/animals/${id}`,
        {
          signal: controller.signal,
        }
      );
      //Set family name on animal objects
      const familyName = await fetchFamilyByUrl(response.data.family);
      const animalData = { ...response.data, family: familyName };
      setAnimal(animalData);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError("Failed to fetch animal");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimal();
    return () => {};
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!animal) return <div className="text-center mt-8">Animal not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="outline"
        onClick={() => navigate("/animals")}
        className="mb-4"
      >
        Back to Animals
      </Button>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <img
            src={
              "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" +
              animal.name.replace(" ", "_") +
              ".jpg"
                ? "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" +
                  animal.name.replace(" ", "_") +
                  ".jpg"
                : "@/public/user_assets/animals_images/" +
                  animal.name.replace(" ", "_") +
                  ".{" +
                  ["jpg", "png", "jpeg"].join("|") +
                  "}"
            }
            alt={animal.name}
            className="w-full h-64 object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
            }}
          />
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <CardTitle className="text-2xl font-bold">{animal.name}</CardTitle>
          <CardDescription className="text-lg">
            {animal.description}
          </CardDescription>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16">
              <img
                src={
                  "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" +
                  animal.family.toLowerCase().replace(" ", "_") +
                  ".svg"
                    ? "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" +
                      animal.family.toLowerCase().replace(" ", "_") +
                      ".svg"
                    : "@/public/user_assets/families_images/" +
                      animal.family.toLowerCase().replace(" ", "_") +
                      ".{" +
                      ["jpg", "png", "jpeg", "svg"].join("|") +
                      "}"
                }
                alt=""
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Family: {animal.family}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalDetail;
