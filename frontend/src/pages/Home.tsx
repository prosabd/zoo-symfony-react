import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const API_URL = import.meta.env.VITE_API_URL;

interface Animal {
  id: number;
  name: string;
  description: string;
}

const Home: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getRandomAnimals = (array: Animal[], count: number) => {
    const limitedArray = array.slice(0, 30);
    const shuffled = [...limitedArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnimals = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Animal[]>(API_URL + `/animals`, {
          signal: controller.signal,
        });
        const animalData = response.data["hydra:member"] || [];
        setAnimals(getRandomAnimals(animalData, 3));
        setError(null);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to fetch animals");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();

    return () => controller.abort();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome ZooExplorer of Animals
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {animals.map((animal) => (
          <Link key={animal.id} to={`/animals/detail/${animal.id}`}>
            <Card key={animal.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img
                  src={`https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/${animal.name.replace(
                    " ",
                    "_"
                  )}.jpg`}
                  alt={animal.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">{animal.name}</CardTitle>
                <CardDescription>{animal.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate("/animals")}
          className="px-8"
        >
          View All Animals
        </Button>
      </div>
    </div>
  );
};

export default Home;
