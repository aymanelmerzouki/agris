<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
class NewsController extends Controller
{
    public function index()
    {
        $news = Cache::remember('agri_news', 3600, function () {
            $key = config('services.newsdata.key');
            if (!$key) return [];
            $response = Http::get('https:
                'apikey'   => $key,
                'q'        => 'agriculture',
                'language' => 'fr',
                'category' => 'science,environment',
            ]);
            if (!$response->ok()) return [];
            return collect($response->json('results') ?? [])
                ->take(6)
                ->map(fn($a) => [
                    'title'       => $a['title'],
                    'description' => $a['description'],
                    'url'         => $a['link'],
                    'image'       => $a['image_url'],
                    'source'      => $a['source_id'],
                    'date'        => $a['pubDate'],
                ])
                ->values();
        });
        return response()->json($news);
    }
}
