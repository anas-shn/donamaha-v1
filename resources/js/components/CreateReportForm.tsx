import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Image as ImageIcon, Send, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreateReportForm = () => {
  const [open, setOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: donations } = useQuery({
    queryKey: ["donations-for-report"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("id, title, organizer_name")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createReport = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reports").insert({
        donation_id: selectedDonation,
        content: content || null,
        image_url: imageUrl || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Berhasil!",
        description: "Laporan berhasil dipublikasikan",
      });
      queryClient.invalidateQueries({ queryKey: ["all-reports"] });
      setOpen(false);
      setSelectedDonation("");
      setContent("");
      setImageUrl("");
    },
    onError: (error) => {
      toast({
        title: "Gagal",
        description: "Tidak dapat membuat laporan. Pastikan Anda adalah penyelenggara.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonation) {
      toast({
        title: "Pilih donasi",
        description: "Silakan pilih kampanye donasi terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    if (!content && !imageUrl) {
      toast({
        title: "Isi konten",
        description: "Silakan isi deskripsi atau tambahkan foto",
        variant: "destructive",
      });
      return;
    }
    createReport.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Buat Laporan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Laporan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Donation Selection */}
          <div className="space-y-2">
            <Label htmlFor="donation">Pilih Kampanye Donasi</Label>
            <Select value={selectedDonation} onValueChange={setSelectedDonation}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih donasi..." />
              </SelectTrigger>
              <SelectContent>
                {donations?.map((donation) => (
                  <SelectItem key={donation.id} value={donation.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{donation.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {donation.organizer_name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              URL Foto (Opsional)
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <div className="rounded-lg overflow-hidden bg-muted aspect-video">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Deskripsi Laporan</Label>
            <Textarea
              id="content"
              placeholder="Ceritakan update atau penyaluran dana terbaru..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={createReport.isPending}
          >
            {createReport.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Publikasikan Laporan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportForm;
