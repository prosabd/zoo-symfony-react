import axios from 'axios';
import { Family } from '@/models/Family';

export async function fetchFamilyByUrl(familyUrl: string): Promise<string>  {
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
        // setLoading(false);
    }
};
