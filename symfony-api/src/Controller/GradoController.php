<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\FrameworkBundle\DependencyInjection\Compiler\ErrorLoggerCompilerPass;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use App\Repository\GradoRepository;
use App\Entity\Grado;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;


final class GradoController extends AbstractController
{

    #[Route('/grado', name: 'grado_index', methods: ['GET'])]
    public function index(
        GradoRepository $gradoRepository,
        #[MapQueryParameter] ?string $nivel
    ): JsonResponse {

        if ($nivel) {
            /** @var Grado[] $grados */
            $grados = $gradoRepository->findByLevel($nivel);

            return $this->json(
                $grados,
                context: ['groups' => ['grado:read']]
            );
        }

        /** @var Grado[] $grados */
        $grados = $gradoRepository->findAll();

        return $this->json(
            $grados,
            context: ['groups' => ['grado:read']]
        );

    }

    #[Route('/grado/{id}', name: 'grado_show', methods: ['GET'])]
    public function show(
        GradoRepository $gradoRepository,
        int $id
    ): JsonResponse {

        /** @var Grado $grado */
        $grado = $gradoRepository->findById($id);

        return $this->json(
            $grado,
            context: ['groups' => ['grado:read']]
        );

    }

    #[Route('/grado', name: 'grado_create', methods: ['POST'])]
    public function create(
        Request $request,
        GradoRepository $gradoRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = $request->getContent();

        try {
            /** @var Grado $grado */
            $grado = $serializer->deserialize($data, Grado::class, 'json');
            $gradoRepository->add($grado, true);
        } catch (\Symfony\Component\Serializer\Exception\ExceptionInterface $e) {
            return $this->json([
                'error' => 'Invalid JSON',
                'details' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Internal server error',
                'details' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($grado, context: ['groups' => ['grado:read']], status: Response::HTTP_CREATED);
    }

    #[Route('/grado/{id}', name: 'grado_delete', methods: ['DELETE'])]
    public function delete(
        Request $request,
        GradoRepository $gradoRepository,
        int $id
    ): JsonResponse {

        /** @var Grado $grado */
        $grado = $gradoRepository->findById($id);

        if (!$grado) {
            return $this->json([
                'error' => 'Grado not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $gradoRepository->remove($grado, true);

        return $this->json([
            'message' => 'Grado deleted successfully',
        ], Response::HTTP_OK);

    }

}
