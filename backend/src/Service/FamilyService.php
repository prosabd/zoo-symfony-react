<?php

namespace App\Service;

use App\Entity\Family;
use Doctrine\ORM\EntityManagerInterface;

class FamilyService
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function createFamily(array $data): Family
    {
        $family = new Family();
        $family->setName($data['name']);
        $family->setDescription($data['description']);
        return $family;
    }

    public function updateFamily(int $id, array $data): Family
    {
        $family = $this->em->getRepository(Family::class)->find($id);
        if (!$family) {
            throw new \Exception('Family not found');
        }
        if (isset($data['name'])) $family->setName($data['name']);
        if (isset($data['description'])) $family->setDescription($data['description']);
        return $family;
    }
}