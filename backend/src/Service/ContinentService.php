<?php

namespace App\Service;

use App\Entity\Continent;
use Doctrine\ORM\EntityManagerInterface;

class ContinentService
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function createContinent(array $data): Continent
    {
        $continent = new Continent();
        $continent->setName($data['name']);
        return $continent;
    }

    public function updateContinent(int $id, array $data): Continent
    {
        $continent = $this->em->getRepository(Continent::class)->find($id);
        if (!$continent) {
            throw new \Exception('Continent not found');
        }
        if (isset($data['name'])) $continent->setName($data['name']);
        return $continent;
    }
}