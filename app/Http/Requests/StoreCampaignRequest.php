<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users with organizer or admin role can create campaigns
        return $this->user() && in_array($this->user()->role, ['organizer', 'admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'full_description' => ['required', 'string', 'min:100'],
            'target_amount' => ['required', 'numeric', 'min:100000'],
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul kampanye wajib diisi.',
            'title.max' => 'Judul kampanye tidak boleh lebih dari 255 karakter.',
            'full_description.required' => 'Deskripsi lengkap kampanye wajib diisi.',
            'full_description.min' => 'Deskripsi lengkap minimal 100 karakter.',
            'target_amount.required' => 'Target donasi wajib diisi.',
            'target_amount.numeric' => 'Target donasi harus berupa angka.',
            'target_amount.min' => 'Target donasi minimal Rp 100.000.',
            'image.required' => 'Gambar kampanye wajib diunggah.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus jpeg, jpg, png, atau webp.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.after_or_equal' => 'Tanggal mulai tidak boleh kurang dari hari ini.',
            'end_date.required' => 'Tanggal selesai wajib diisi.',
            'end_date.after' => 'Tanggal selesai harus setelah tanggal mulai.',
        ];
    }
}
