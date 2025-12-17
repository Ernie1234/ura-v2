import React, { useState } from "react";
import { Camera, Image as ImageIcon, Save, Loader2, User, Lock } from "lucide-react";
import { useAuthContext } from "@/context/auth-provider";
import BusinessWarningModal from "../ui/BusinessWarningModal";
import { useUpdateProfile } from "@/hooks/api/use-user-profile";

const PersonalInfoForm: React.FC = () => {
    const { user } = useAuthContext();
    const { mutate, isPending } = useUpdateProfile();
    const [showBusinessModal, setShowBusinessModal] = useState(false);

    // 1. Store Previews (for UI) AND actual Files (for Upload)
    const [previews, setPreviews] = useState({
        profilePicture: user?.profilePicture || null,
        coverPicture: user?.coverPicture || null, // Ensure this matches your user object key
    });

    const [files, setFiles] = useState<{ profilePicture: File | null; coverPicture: File | null }>({
        profilePicture: null,
        coverPicture: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profilePicture' | 'coverPicture') => {
        const file = e.target.files?.[0];
        if (file) {
            // Save the actual file for the API call
            setFiles(prev => ({ ...prev, [type]: file }));

            // Create a preview for the UI
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        // 2. Use FormData to easily grab input values by their "name" attribute
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        mutate({
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            bio: formData.get("bio") as string, // Added bio here
            profilePicture: files.profilePicture, // Actual File object
            coverPicture: files.coverPicture,         // Actual File object
        });
    };

    return (
        <form onSubmit={handleSave} className="divide-y divide-gray-100">
            {/* Header Section */}
            <div className="p-6 md:p-10 space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Profile Identity</h3>
                    <p className="text-sm text-gray-500">Update your photos and personal details.</p>
                </div>

                {/* Cover Photo */}
                <div className="relative group h-48 rounded-2xl bg-gray-100 overflow-hidden border border-gray-200">
                    {previews.coverPicture ? (
                        <img src={previews.coverPicture} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No cover photo set</div>
                    )}
                    <label className="absolute bottom-4 right-4 bg-white/90 backdrop-blur shadow-sm px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer hover:bg-white transition flex items-center gap-2">
                        <ImageIcon size={16} /> Change Cover
                        <input type="file" name="coverPicture" hidden onChange={(e) => handleFileChange(e, 'coverPicture')} accept="image/*" />
                    </label>
                </div>

                {/* Profile Picture */}
                <div className="flex items-end gap-6 -mt-16 ml-8 relative z-10">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gray-200 overflow-hidden">
                            {previews.profilePicture ? (
                                <img src={previews.profilePicture} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <User size={40} className="text-gray-500" />
                                </div>
                            )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                            <Camera className="text-white" size={24} />
                            <input type="file" name="profilePicture" hidden onChange={(e) => handleFileChange(e, 'profilePicture')} accept="image/*" />
                        </label>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-bold text-gray-900">Profile Picture</h4>
                        <p className="text-xs text-gray-500">Recommended: 400x400px</p>
                    </div>
                </div>
            </div>

            {/* Editable Fields - Added 'name' attributes for FormData */}
            {/* Basic Information + Bio */}
            <div className="p-6 md:p-10">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Basic Information</h4>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">First Name</label>
                            <input
                                name="firstName"
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none"
                                defaultValue={user?.firstName}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Last Name</label>
                            <input
                                name="lastName"
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none"
                                defaultValue={user?.lastName}
                            />
                        </div>
                    </div>

                    {/* Bio Section Added Here */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Bio</label>
                        <textarea
                            name="bio"
                            rows={4}
                            placeholder="Tell us a little about yourself..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition-all resize-none"
                            defaultValue={user?.bio}
                        />
                        <p className="text-xs text-gray-400 text-right">Brief description for your profile.</p>
                    </div>
                </div>
            </div>

            {/* Read-Only Account Section */}
            <div className="p-6 md:p-10 bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Lock size={14} /> Account Credentials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                        <div className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed flex justify-between items-center">
                            <span>@{user?.username}</span>
                            <Lock size={14} className="opacity-50" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                        <div className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed flex justify-between items-center">
                            <span>{user?.email}</span>
                            <Lock size={14} className="opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Conversion */}
            {!user?.isBusinessOwner && (
                <div className="p-6 md:p-10">
                    <div className="p-6 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h4 className="font-bold text-orange-900 text-lg">Are you a Business?</h4>
                            <p className="text-orange-700 text-sm">Sell products, get reviewed, and access business insights.</p>
                        </div>
                        <button type="button" onClick={() => setShowBusinessModal(true)} className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition">
                            Convert to Business
                        </button>
                    </div>
                </div>
            )}

            {/* Submit Section */}
            <div className="p-8 bg-gray-50/50 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Personal Info
                </button>
            </div>
            {showBusinessModal && <BusinessWarningModal onClose={() => setShowBusinessModal(false)} />}
        </form>
    );
};

export default PersonalInfoForm;