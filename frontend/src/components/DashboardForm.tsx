import { useState, useEffect } from 'react';
import instance from '@/utils/userInstance';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, ChevronDown } from 'lucide-react';
import User from "@/models/User";
import Animal from "@/models/Animal";
import Family from "@/models/Family";
import Continent from "@/models/Continent";

interface DashboardFormProps {
  id?: number;
  type: 'users' | 'animals' | 'families' | 'continents';
  onClose: () => void;
  onSubmit: (item: any) => void;
}

const DashboardForm = ({ id, type, onClose, onSubmit }: DashboardFormProps) => {
    const [item, setItem] = useState<User | Animal | Family | Continent>({} as any);
    const [families, setFamilies] = useState<Family[]>([]);
    const [continents, setContinents] = useState<Continent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          
          try {
            // Fetch item if we have an ID
            if (id) {
              const itemResponse = await instance.get(`/${type.toLowerCase()}/${id}`);
              setItem(itemResponse.data);

              // Set selectedContinents for animal form dropdown menu
              if (type === 'animals' && itemResponse.data.continents) {
                  setSelectedContinents(itemResponse.data.continents?.map(c => c.id?.toString()) || []);
                }
                
                // Fetch animals related to the continent
                if (type === 'continents') {
                    const animalsRes = await instance.get(`/continents/${id}`);
                    setAnimals(animalsRes.data.animals);
                } 
                // Fetch all animals and filter by family
                else if (type === 'families') {
                    const animalsRes = await instance.get('/animals');
                    const filteredAnimals = animalsRes.data['hydra:member'].filter(
                        (animal: Animal) => animal.family && animal.family.id === id
                    );
                    setAnimals(filteredAnimals);
                }
            }

            // Fetch families and continents for dropdown menus
            const [familiesRes, continentsRes] = await Promise.all([
              instance.get('/families'),
              instance.get('/continents')
            ]);
      
            // Set Families and Continents for dropdown menus
            setFamilies(familiesRes.data['hydra:member']);
            setContinents(continentsRes.data['hydra:member']);
          } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again.');
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, [id, type]);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const newItem: Partial<User | Animal | Family | Continent> = {} as any;
  
      switch (type) {
        case 'users':
          newItem.customUsername = formData.get('customUsername') as string;
          newItem.email = formData.get('email') as string;
          newItem.isAdmin = true;
          newItem.roles = ['ROLE_USER', 'ROLE_ADMIN'];
          break;
        case 'animals':
          newItem.name = formData.get('name') as string;
          newItem.description = formData.get('description') as string;
          newItem.family = `/api/families/${formData.get('family')}`;
          newItem.continents = selectedContinents.map(
            (id) => `/api/continents/${id}`
          );
          break;
        case 'families':
          newItem.name = formData.get('name') as string;
          newItem.description = formData.get('description') as string;
          break;
        case 'continents':
          newItem.name = formData.get('name') as string;
          break;
      }

      if (id) {
          await instance.patch(`/admin/dashboard/update/${type}/${id}`, newItem);
      } else {
          await instance.post(`/admin/dashboard/add/${type}`, newItem);
      }
      onSubmit(newItem);
    };

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
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{type.toUpperCase()} Form</DialogTitle>
            <DialogDescription>Fill in the form to add or edit a {type}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {type === 'users' && (
              <>
                <Label htmlFor="customUsername">Custom Username</Label>
                <Input type="text" id="customUsername" name="customUsername" defaultValue={item.customUsername} />
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" defaultValue={item.email} />
              </>
            )}
            {type === 'animals' && (
              <>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" defaultValue={item.name} />
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={item.description} />
                <Label htmlFor="family">Family</Label>
                <Select name='family' defaultValue={item.family?.id?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder={"Select Family"} />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map(family => (
                        <SelectItem key={family.id} value={family.id.toString()}>
                        {family.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Label>Continents</Label>
                <div className="grid grid-cols-2 gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-full">
                        <Button variant="outline" className="w-full flex items-center justify-between">
                            <span>Select Continents</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                        {continents.map((continent) => (
                            <DropdownMenuCheckboxItem
                            key={continent.id}
                            checked={selectedContinents.includes(continent.id.toString())}
                            onSelect={(e) => e.preventDefault()}
                            onCheckedChange={() => {
                                setSelectedContinents(prev => {
                                if (prev.includes(continent.id.toString())) {
                                    return prev.filter(id => id !== continent.id.toString());
                                }
                                return [...prev, continent.id.toString()];
                                });
                            }}
                            >
                            {continent.name}
                            </DropdownMenuCheckboxItem>
                        ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </>
            )}
            {type === 'families' && (
              <>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" defaultValue={item.name} />
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={item.description} />
                {animals.length > 0 && 
                  <>
                    <Label>Animals</Label>
                    <ScrollArea className="h-72 w-full rounded-md border">
                    <div className="p-4">
                        {animals.map(animal => (
                        <div key={animal.id}>
                            <div className="text-sm">{animal.name}</div>
                            <Separator className="my-2" />
                        </div>
                        ))}
                    </div>
                    </ScrollArea>
                  </>
                }
              </>
            )}
            {type === 'continents' && (
              <>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" defaultValue={item.name} />
                {animals.length > 0 && 
                  <>
                    <Label>Animals</Label>
                    <ScrollArea className="h-72 w-full rounded-md border">
                    <div className="p-4">
                        {animals.map(animal => (
                            <div key={`animal-${animal.id}`}>
                                <div className="text-sm">
                                    {animal.name}
                                </div>
                                <Separator className="my-2" />
                            </div>
                        ))}
                    </div>
                    </ScrollArea>
                  </>
                }
              </>
            )}
            <DialogFooter className='pt-4'>
              <Button variant="outline" size="lg" onClick={onClose}>Cancel</Button>
              <Button type="submit" size="lg">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default DashboardForm;