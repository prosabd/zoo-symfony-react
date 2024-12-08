<?php

namespace App\Service;

use App\Entity\Animal;
use App\Entity\Family;
use App\Entity\Continent;
use Doctrine\ORM\EntityManagerInterface;

class AnimalService
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function createAnimal(array $data): Animal
    {
        $animal = new Animal();
        $animal->setName($data['name']);
        $animal->setDescription($data['description']);

        // Handle family reference
        $familyId = substr($data['family'], strrpos($data['family'], '/') + 1);
        $family = $this->em->getRepository(Family::class)->find($familyId);
        $animal->setFamily($family);

        // Handle continents
        foreach ($data['continents'] as $continentUri) {
            $continentId = substr($continentUri, strrpos($continentUri, '/') + 1);
            $continent = $this->em->getRepository(Continent::class)->find($continentId);
            $animal->addContinent($continent);
        }

        return $animal;
    }

    public function updateAnimal(int $id, array $data): Animal
    {
        $animal = $this->em->getRepository(Animal::class)->find($id);
        if (!$animal) {
            throw new \Exception('Animal not found');
        }
        // ...existing code...
        if (isset($data['name'])) $animal->setName($data['name']);
        if (isset($data['description'])) $animal->setDescription($data['description']);
        if (isset($data['family'])) {
            $familyId = substr($data['family'], strrpos($data['family'], '/') + 1);
            $family = $this->em->getRepository(Family::class)->find($familyId);
            $animal->setFamily($family);
        }
        if (isset($data['continents'])) {
            // Clear existing continents
            foreach ($animal->getContinents() as $continent) {
                $animal->removeContinent($continent);
            }
            // Add new continents
            foreach ($data['continents'] as $continentUri) {
                $continentId = substr($continentUri, strrpos($continentUri, '/') + 1);
                $continent = $this->em->getRepository(Continent::class)->find($continentId);
                $animal->addContinent($continent);
            }
        }
        return $animal;
    }
}