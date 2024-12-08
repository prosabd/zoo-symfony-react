<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserService
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function createUser(array $data): User
    {
        $user = new User();
        $user->setCustomUsername($data['customUsername']);
        $user->setEmail($data['email']);
        $user->setRoles($data['roles']);
        $user->setAdmin($data['isAdmin']);
        // Note: Add password hashing here if needed
        return $user;
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->em->getRepository(User::class)->find($id);
        if (!$user) {
            throw new \Exception('User not found');
        }
        if (isset($data['customUsername'])) $user->setCustomUsername($data['customUsername']);
        if (isset($data['email'])) $user->setEmail($data['email']);
        if (isset($data['roles'])) $user->setRoles($data['roles']);
        if (isset($data['isAdmin'])) $user->setAdmin($data['isAdmin']);
        return $user;
    }
}