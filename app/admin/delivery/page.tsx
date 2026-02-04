"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Truck,
  MapPin,
  DollarSign,
  Save,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface DeliveryZone {
  _id: string;
  name: string;
  cities: string[];
  cost: number;
  estimatedDays: string;
}

export default function DeliveryPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [zones, setZones] = useState<DeliveryZone[]>([
    {
      _id: "1",
      name: "القاهرة الكبرى",
      cities: ["القاهرة", "الجيزة", "القليوبية"],
      cost: 50,
      estimatedDays: "1-2 أيام",
    },
    {
      _id: "2",
      name: "الدلتا",
      cities: [
        "الإسكندرية",
        "الدقهلية",
        "الشرقية",
        "الغربية",
        "المنوفية",
        "البحيرة",
        "كفر الشيخ",
        "دمياط",
      ],
      cost: 70,
      estimatedDays: "2-3 أيام",
    },
    {
      _id: "3",
      name: "الصعيد",
      cities: [
        "الأقصر",
        "أسوان",
        "قنا",
        "سوهاج",
        "أسيوط",
        "المنيا",
        "بني سويف",
        "الفيوم",
      ],
      cost: 100,
      estimatedDays: "3-5 أيام",
    },
  ]);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cities: "",
    cost: "",
    estimatedDays: "",
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredZones = zones.filter(
    (zone) =>
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.cities.some((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.cities ||
      !formData.cost ||
      !formData.estimatedDays
    ) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const newZone: DeliveryZone = {
      _id: Date.now().toString(),
      name: formData.name,
      cities: formData.cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      cost: parseFloat(formData.cost),
      estimatedDays: formData.estimatedDays,
    };

    if (isEditing) {
      setZones(
        zones.map((z) =>
          z._id === isEditing ? { ...newZone, _id: isEditing } : z,
        ),
      );
      toast.success("تم تحديث منطقة التوصيل بنجاح");
      setIsEditing(null);
    } else {
      setZones([...zones, newZone]);
      toast.success("تم إضافة منطقة التوصيل بنجاح");
      setIsCreating(false);
    }

    resetForm();
  };

  const handleEdit = (zone: DeliveryZone) => {
    setIsEditing(zone._id);
    setFormData({
      name: zone.name,
      cities: zone.cities.join(", "),
      cost: zone.cost.toString(),
      estimatedDays: zone.estimatedDays,
    });
    setIsCreating(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف منطقة "${name}"؟`)) {
      setZones(zones.filter((z) => z._id !== id));
      toast.success("تم حذف منطقة التوصيل بنجاح");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cities: "",
      cost: "",
      estimatedDays: "",
    });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsCreating(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">إدارة التوصيل</h1>
        </div>
        {!isCreating && !isEditing && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة منطقة توصيل
          </Button>
        )}
      </div>

      {/* Search Bar */}
      {!isCreating && !isEditing && (
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن منطقة أو مدينة..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "تعديل منطقة التوصيل" : "إضافة منطقة توصيل جديدة"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المنطقة</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="مثال: القاهرة الكبرى"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cities">المدن (مفصولة بفاصلة)</Label>
              <Input
                id="cities"
                value={formData.cities}
                onChange={(e) =>
                  setFormData({ ...formData, cities: e.target.value })
                }
                placeholder="مثال: القاهرة, الجيزة, القليوبية"
              />
              <p className="text-xs text-muted-foreground">
                يرجى إدخال المدن مفصولة بفاصلة
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">تكلفة التوصيل (جنيه)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  placeholder="50"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDays">المدة المتوقعة</Label>
                <Input
                  id="estimatedDays"
                  value={formData.estimatedDays}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedDays: e.target.value })
                  }
                  placeholder="1-2 أيام"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="ml-2 h-4 w-4" />
                حفظ
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Zones List */}
      <div className="grid gap-4">
        {filteredZones.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {searchQuery ? "لم يتم العثور على نتائج" : "لا توجد مناطق توصيل"}
            </CardContent>
          </Card>
        ) : (
          filteredZones.map((zone) => (
            <Card key={zone._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">{zone.name}</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {zone.cities.map((city, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                          >
                            {city}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-primary">
                            {zone.cost} جنيه
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {zone.estimatedDays}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(zone)}
                    >
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(zone._id, zone.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
