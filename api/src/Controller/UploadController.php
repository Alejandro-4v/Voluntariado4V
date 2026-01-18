<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

final class UploadController extends AbstractController
{
    #[Route('/upload', name: 'api_upload', methods: ['POST'])]
    public function upload(Request $request, SluggerInterface $slugger): JsonResponse
    {
        try {
            error_log("UploadController: Request received");
            $file = $request->files->get('file');

            if (!$file) {
                error_log("UploadController: No file found in request");
                return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
            }

            error_log("UploadController: File found. Original Name: " . $file->getClientOriginalName());

            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            error_log("UploadController: Slugifying filename: " . $originalFilename);
            $safeFilename = $slugger->slug($originalFilename);
            error_log("UploadController: Slugified: " . $safeFilename);

            $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

            error_log("UploadController: Attempting to move to " . $this->getParameter('kernel.project_dir') . '/public/uploads/' . $newFilename);

            $file->move(
                $this->getParameter('kernel.project_dir') . '/public/uploads',
                $newFilename
            );
            error_log("UploadController: Move successful");

            // Generate the URL (adjust based on your server setup)
            // Assuming the API is served from the public directory directly or via symfony server
            $requestShim = $request->getSchemeAndHttpHost();
            $url = $requestShim . '/uploads/' . $newFilename;

            return $this->json([
                'url' => $url,
                'filename' => $newFilename
            ]);
        } catch (\Throwable $e) {
            error_log("UploadController: CRITICAL ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return $this->json(['error' => 'Critical Error: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
