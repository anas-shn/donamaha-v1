<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Campaign>
 */
class CampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 month', 'now');
        $endDate = fake()->dateTimeBetween($startDate, '+3 months');
        $targetAmount = fake()->numberBetween(1000000, 100000000);
        $collectedAmount = fake()->numberBetween(0, $targetAmount);

        return [
            'organizer_id' => User::factory()->create(['role' => 'organizer']),
            'title' => fake()->sentence(6),
            'full_description' => fake()->paragraphs(3, true),
            'target_amount' => $targetAmount,
            'collected_amount' => $collectedAmount,
            'status' => fake()->randomElement(['active', 'completed', 'cancelled']),
            'image_path' => null,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }

    /**
     * Indicate that the campaign is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'start_date' => now()->subDays(7),
            'end_date' => now()->addDays(30),
        ]);
    }

    /**
     * Indicate that the campaign is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'collected_amount' => $attributes['target_amount'],
            'start_date' => now()->subMonths(2),
            'end_date' => now()->subDays(7),
        ]);
    }

    /**
     * Indicate that the campaign is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'start_date' => now()->subDays(30),
            'end_date' => now()->subDays(15),
        ]);
    }

    /**
     * Indicate that the campaign has an image.
     */
    public function withImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'image_path' => 'campaigns/test-image.jpg',
        ]);
    }

    /**
     * Indicate that the campaign belongs to a specific organizer.
     */
    public function forOrganizer(User $organizer): static
    {
        return $this->state(fn (array $attributes) => [
            'organizer_id' => $organizer->id,
        ]);
    }
}
