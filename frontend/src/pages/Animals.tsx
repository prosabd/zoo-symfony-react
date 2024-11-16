import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Family {
  id: number;
  name: string;
}

interface Animal {
  id: number;
  name: string;
  description: string;
  family: string;
}

const Home: React.FC = () => {
    // Browser settings part
  const { family: familyParam } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  // Page part
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any | null>(null);

  const fetchAnimals = async (pageNumber: number) => {
    const controller = new AbortController();
    try {
      setLoading(true);
      // Fetch family details by name to render all animals or filtered by family
      let url;
      if (familyParam) {
        // Fetch family details by name
        const familyResponse = await axios.get<Family[]>(`http://localhost:8000/api/families`);
        // console.log(familyResponse.data);
        const family = familyResponse.data.member.filter(family => family.name === familyParam);
        // console.log(family[0].id);
        if (!family) throw new Error("Family not found");

        // Fetch animals with the family ID
        url = `http://localhost:8000/api/animals?family=/api/families/${family[0].id}&page=${pageNumber}`;
      } else {
        // Fetch animals without filtering by family
        url = `http://localhost:8000/api/animals?page=${pageNumber}`;
      }

      const response = await axios.get<Animal[]>(url, {
        signal: controller.signal,
      });
      console.log(response);
      setResponse(response);
      let animalData = response.data['member'] || [];

      //Set family name on animal objects
      animalData = await Promise.all(animalData.map(async (animal: Animal) => {
        const familyName = await fetchFamily(animal.family);
        return { ...animal, family: familyName };
      }));

      setAnimals(animalData);
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

  const fetchFamily = async (familyUrl: string): Promise<string> => {
    const controller = new AbortController();
    try {
        // Extract ID from URL (e.g., "/api/families/2" -> "2")
        const familyId = familyUrl.split('/').pop();
        
        if (!familyId) {
        throw new Error('Invalid family URL');
        }

        const response = await axios.get<Family>(
        `http://localhost:8000/api/families/${familyId}`, 
        { signal: controller.signal }
        );

        return response.data.name;
    } catch (err) {
        if (!axios.isCancel(err)) {
        console.error('Failed to fetch family:', err);
        throw err;
        }
        return '';
    } finally {
        setLoading(false);
    }
    };

  const handleNextPage = async () => {
    const nextPage = page + 1;
    const baseUrl = familyParam ? `/animals/${familyParam}` : '/animals';
    navigate(`${baseUrl}?page=${nextPage}`);
  };

  const handlePreviousPage = async () => {
    const previousPage = page - 1;
    const baseUrl = familyParam ? `/animals/${familyParam}` : '/animals';
    navigate(`${baseUrl}?page=${previousPage}`);
  };

  useEffect(() => {
    fetchAnimals(page);
    return () => {};
  }, [page, familyParam, order]);

  if (loading) return <div>Loading...</div>;
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
          {Array.isArray(animals) && animals.sort((a, b) => order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)).map(animal => (
            <Card key={animal.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <img 
                  // Let's check if the item is a basic item and its photo exists on the server, or if it is a user-created item and its photo exists in the public/user_assets/animals_images folder           
                  src={"https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" + (animal.name).replace(' ', '_') + ".jpg" ? "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" + (animal.name).replace(' ', '_') + ".jpg" : "@/public/user_assets/animals_images/" + (animal.name).replace(' ', '_') + ".{" + ['jpg', 'png', 'jpeg'].join('|') + "}" }
                  alt={animal.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">{animal.name}</CardTitle>
                <CardDescription>{animal.description}</CardDescription>
                {!familyParam && 
                    <p className="text-sm text-muted-foreground mt-2">
                        Family: {animal.family}
                    </p>
                }
              </CardContent>
            </Card>
          ))}
        </div>
          <Button className="mt-4 mx-2 " onClick={handlePreviousPage} disabled={page <= 1}> 
            Previous Page
          </Button>
          <Button className="mt-4 mx-2" onClick={handleNextPage} 
                  //verify if the current page is the last page, if it is, disable the next button
                  disabled={response?.data?.view?.last ? response?.data?.view?.['@id'] === response?.data?.view?.last : true}> 
            Next Page
          </Button>
      </div>
    </>
  );
};

export default Home;