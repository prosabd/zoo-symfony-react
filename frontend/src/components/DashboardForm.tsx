import { useState, useEffect } from 'react';
import instance from '@/utils/userInstance';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from 'lucide-react';
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

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          
          try {
            // Fetch item if we have an ID
            if (id) {
              const itemResponse = await instance.get(`/${type.toLowerCase()}/${id}`);
              setItem(itemResponse.data);
            }
            
            // Always fetch reference data
            const [familiesRes, continentsRes] = await Promise.all([
              instance.get('/families'),
              instance.get('/continents')
            ]);
      
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
        newItem.continents = continents
            .filter(continent => (formData.get(`continent-${continent.id}`) as string) === 'on')
            .map(continent => `/api/continents/${continent.id}`);
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
        await instance.put(`/admin/dashboard/update/${type}/${id}`, newItem);
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
            <DialogTitle>{type} Form</DialogTitle>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Family" />
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
                <div className="grid grid-cols-2 pt-4 gap-4">
                    {continents.map(continent => (
                    <div key={continent.id} className="flex items-center space-x-2">
                        <Checkbox
                        id={`continent-${continent.id}`}
                        name={`continent-${continent.id}`}
                        defaultChecked={item.continents?.some(c => c.id === continent.id)}
                        className=''
                        />
                        <Label 
                        htmlFor={`continent-${continent.id}`}
                        className="font-normal"
                        >
                        {continent.name}
                        </Label>
                    </div>
                    ))}
                </div>
              </>
            )}
            {type === 'families' && (
              <>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" defaultValue={item.name} />
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={item.description} />
              </>
            )}
            {type === 'continents' && (
              <>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" defaultValue={item.name} />
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