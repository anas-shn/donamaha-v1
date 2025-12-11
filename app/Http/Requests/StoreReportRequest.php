<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // User must be authenticated
        if (! $this->user()) {
            return false;
        }

        // Only organizers and admins can create reports
        if (! in_array($this->user()->role, ['organizer', 'admin'])) {
            return false;
        }

        // Admins can create reports for any campaign
        if ($this->user()->role === 'admin') {
            return true;
        }

        // Organizers can only create reports for their own campaigns
        if ($this->has('campaign_id')) {
            $campaign = \App\Models\Campaign::find($this->campaign_id);
            if ($campaign && $campaign->organizer_id !== $this->user()->id) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'campaign_id' => ['required', 'exists:campaigns,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'min:100'],
            'total_spent' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
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
            'campaign_id.required' => 'Kampanye harus dipilih.',
            'campaign_id.exists' => 'Kampanye yang dipilih tidak valid.',
            'title.required' => 'Judul laporan harus diisi.',
            'title.max' => 'Judul laporan tidak boleh lebih dari 255 karakter.',
            'content.required' => 'Konten laporan harus diisi.',
            'content.min' => 'Konten laporan minimal 100 karakter.',
            'total_spent.required' => 'Total dana yang digunakan harus diisi.',
            'total_spent.numeric' => 'Total dana harus berupa angka.',
            'total_spent.min' => 'Total dana tidak boleh kurang dari 0.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Gambar harus berformat: jpeg, jpg, png, atau webp.',
            'image.max' => 'Ukuran gambar tidak boleh lebih dari 2MB.',
        ];
    }
}
