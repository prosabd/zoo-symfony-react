import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Animal from "@/models/Animal";
import Family from "@/models/Family";
const API_URL = import.meta.env.VITE_API_URL;

const Home: React.FC = () => {
  // Browser settings part
  const { family: familyParam } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  // Page part
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<any | null>(null);

  const fetchAnimals = async (pageNumber: number) => {
    const controller = new AbortController();
    try {
      setLoading(true);
      // Fetch family details by name to render all animals or filtered by family
      let url;
      if (familyParam) {
        // Fetch family details by name
        const familyResponse = await axios.get<Family[]>(API_URL + `/families`);
        const family = familyResponse.data["hydra:member"].filter(
          (family) => family.name === familyParam
        );
        if (!family) throw new Error("Family not found");

        // Fetch animals with the family ID
        url = API_URL + `/animals?family=/api/families/${family[0].id}&page=${pageNumber}`;
      } else {
        // Fetch animals without filtering by family
        url = API_URL + `/animals?page=${pageNumber}`;
      }

      const response = await axios.get<Animal[]>(url, {
        signal: controller.signal,
      });
      setView(response.data?.["hydra:view"]);
      let animalData = response.data["hydra:member"] || [];

      //Set family name on animal objects
      animalData = await Promise.all(
        animalData.map(async (animal: Animal) => {
          const familyName = animal.family.name;
          return { ...animal, family: familyName };
        })
      );

      setAnimals(animalData);
      setError(null);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError("Failed to fetch " + (familyParam ?? "") + " animals");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = async () => {
    const nextPage = page + 1;
    const baseUrl = familyParam ? `/animals/${familyParam}` : "/animals";
    navigate(`${baseUrl}?page=${nextPage}`);
  };

  const handlePreviousPage = async () => {
    const previousPage = page - 1;
    const baseUrl = familyParam ? `/animals/${familyParam}` : "/animals";
    navigate(`${baseUrl}?page=${previousPage}`);
  };

  useEffect(() => {
    fetchAnimals(page);
    return () => {};
  }, [page, familyParam, order]);

  if (loading) {
    return ( 
        <Button className="flex justify-center items-center" disabled>
            <Loader2 className="animate-spin" />
            Please wait
        </Button>
    )
  }
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="container mx-auto p-4 text-center">
        <div className="w-48 mx-auto p-4 pt-1">
          <Label htmlFor="order">Order</Label>
          <Select onValueChange={setOrder} defaultValue={order}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* // Sort element by name (or order value selected) and display them */}
          {Array.isArray(animals) &&
            animals
              .sort((a, b) =>
                order === "asc"
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name)
              )
              .map((animal) => (
                <Link key={animal.id} to={`/animals/detail/${animal.id}`}>
                  <Card key={animal.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <img
                        // Let's check if the item is a basic item and its photo exists on the server, or if it is a user-created item and its photo exists in the public/user_assets/animals_images folder
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
                        className="w-full h-48 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-xl mb-2">
                        {animal.name}
                      </CardTitle>
                      <CardDescription>{animal.description}</CardDescription>
                      {!familyParam && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Family: {animal.family}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
        <Button
          className="mt-4 mx-2 "
          onClick={handlePreviousPage}
          disabled={page <= 1}
        >
          Previous Page
        </Button>
        <Button
          className="mt-4 mx-2"
          onClick={handleNextPage}
          //verify if the current page is the last page, if it is, disable the next button
          disabled={
            view?.["hydra:last"]
              ? view?.["@id"] ===
                view?.["hydra:last"]
              : true
          }
        >
          Next Page
        </Button>
      </div>
    </>
  );
};

export default Home;
