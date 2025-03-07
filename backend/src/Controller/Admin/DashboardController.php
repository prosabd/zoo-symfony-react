<?php

namespace App\Controller\Admin;

use App\Service\UserService;
use App\Service\AnimalService;
use App\Service\FamilyService;
use App\Service\ContinentService;
use App\Controller\AuthController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DashboardController extends AbstractController
{
    private EntityManagerInterface $em;
    private UserService $userService;
    private AnimalService $animalService;
    private FamilyService $familyService;
    private ContinentService $continentService;
    private AuthController $authController;

    public function __construct(
        EntityManagerInterface $em,
        UserService $userService,
        AnimalService $animalService,
        FamilyService $familyService,
        ContinentService $continentService,
        AuthController $authController
    ) {
        $this->em = $em;
        $this->userService = $userService;
        $this->animalService = $animalService;
        $this->familyService = $familyService;
        $this->continentService = $continentService;
        $this->authController = $authController;
    }

    #[Route('/api/admin/dashboard/add/{type}', name: 'admin_dashboard_add', methods: ['POST'])]
    public function addItem(Request $request, string $type): JsonResponse
    {
        try {
            if ($type === 'users') {
                return $this->authController->register($request);
            }

            $data = json_decode($request->getContent(), true);
            $entity = match($type) {
                'animals' => $this->animalService->createAnimal($data),
                'families' => $this->familyService->createFamily($data),
                'continents' => $this->continentService->createContinent($data),
                default => throw new \InvalidArgumentException('Invalid type')
            };

            $this->em->persist($entity);
            $this->em->flush();

            return new JsonResponse(['message' => 'Item created successfully'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/api/admin/dashboard/update/{type}/{id}', name: 'admin_dashboard_update', methods: ['PATCH'])]
    public function updateItem(Request $request, string $type, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $entity = match($type) {
                'users' => $this->userService->updateUser($id, $data),
                'animals' => $this->animalService->updateAnimal($id, $data),
                'families' => $this->familyService->updateFamily($id, $data),
                'continents' => $this->continentService->updateContinent($id, $data),
                default => throw new \InvalidArgumentException('Invalid type')
            };

            $this->em->flush();

            return new JsonResponse(['message' => 'Item updated successfully']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }


}
