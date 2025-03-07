<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_ADMIN')",
    normalizationContext: ['groups' => ['read'], 'enable_max_depth' => true],
    denormalizationContext: ['groups' => ['write'], 'enable_max_depth' => true]
)]

class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read'])]  // Only readable, not writable
    private ?int $id = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(['read', 'write'])]
    private ?string $customUsername = null;
    
    #[ORM\Column(length: 255, unique: true, nullable: false)]
    #[Groups(['read'])]  // Only readable, not writable
    private ?string $email;
    
    #[ORM\Column(length: 255, nullable: false)]
    #[Groups(['read', 'write'])]
    private ?string $password;
    
    #[ORM\Column]
    #[Groups(['read', 'write'])]
    private ?bool $is_admin = true;
    
    #[ORM\Column(type: Types::JSON)]
    #[Groups(['read', 'write'])]
    private array $roles = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCustomUsername(): ?string
    {
        return $this->customUsername;
    }

    public function setCustomUsername(string $username): static
    {
        $this->customUsername = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function isAdmin(): ?bool
    {
        return $this->is_admin;
    }

    public function setAdmin(bool $is_admin): static
    {
        $this->is_admin = $is_admin;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = array_unique($roles);
        return $this;
    }

    public function addRole(string $role): static
    {
        if (!in_array($role, $this->roles)) {
            $this->roles[] = $role;
        }
        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }
}
