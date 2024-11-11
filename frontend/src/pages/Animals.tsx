import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any | null>(null);

  const fetchAnimals = async (pageNumber: number) => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const response = await axios.get<Animal[]>(`http://localhost:8000/api/animals?page=${pageNumber}`, {
        signal: controller.signal,
      });
      console.log(response);
      setResponse(response);
      let animalData = response.data['member'] || [];
      
      // Filter by family if family parameter exists
      if (familyParam) {
        animalData = animalData.filter(async (animal: Animal) => {
            const familyName = await fetchFamily(animal.family);
            return familyName.toLowerCase() === familyParam.toLowerCase();
          });
      } else {
        // Fetch family name for each animal
        animalData = await Promise.all(animalData.map(async (animal: Animal) => {
          const familyName = await fetchFamily(animal.family);
          return { ...animal, family: familyName };
        }));
      }
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
  }, [page, familyParam]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(animals) && animals.map(animal => (
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
        {response?.data?.view?.previous && (
          <Button 
            className="mt-4 mx-2 " 
            onClick={handlePreviousPage}
          > 
            Previous Page
          </Button>
        )}
        {response?.data?.view?.next && (
          <Button 
            className="mt-4 mx-2" 
            onClick={handleNextPage}
          > 
            Next Page
          </Button>
        )}
      </div>
    </>
  );
};

export default Home;