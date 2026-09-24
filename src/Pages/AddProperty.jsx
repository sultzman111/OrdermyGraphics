import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProperty = ({ onAddProperty }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Project');
  const [basePrice, setBasePrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CATEGORIES = [
    'Project',
    'Web Design',
    'Frames',
    'Flyers & Posters',
    'Logos & Branding',
    'Banners & Signage',
    'Business Cards',
    'Custom Artwork'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size is too large! Please upload an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !basePrice || !category) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    const customUid = `OMG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newDesignServiceData = {
      id: customUid,
      uid: customUid,
      title: title.trim(),
      category: category,
      basePrice: Number(basePrice),
      description: description.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      createdAt: Date.now()
    };

    try {
      await onAddProperty(newDesignServiceData);
      navigate('/service');
    } catch (error) {
      console.error("Failed to list design product:", error);
      alert("Something went wrong while uploading your listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-screen flex items-center justify-center font-sans bg-black text-neutral-100">
      <div className="w-full bg-neutral-900 border border-neutral-800 shadow-2xl rounded-3xl p-6 md:p-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            List a New <span className="text-orange-500">Service</span> or Product
          </h1>
          <p className="text-xs text-neutral-400">Post web designs, projects, photo frames, or custom graphics.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Post Under Category / Subfolder *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-neutral-900 text-white">
                  📂 {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Service / Item Title *
            </label>
            <input 
              type="text"
              placeholder="e.g. Full-Stack Web Design & React Landing Page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Base Price (₦) *
            </label>
            <input 
              type="number"
              placeholder="e.g. 25000"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Package / Item Description
            </label>
            <textarea 
              rows={3}
              placeholder="Specify requirements, tech stack, deliverables, or turnaround times..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Preview Photo / Screenshot *
            </label>
            
            <div className="border-2 border-dashed border-neutral-800 bg-neutral-950 p-4 rounded-xl text-center hover:border-orange-500/50 transition-colors">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer text-xs font-bold text-orange-400 hover:text-orange-300">
                📁 Click here to choose a photo from your Device / PC
              </label>
              <p className="text-[10px] text-neutral-500 mt-1">Supports PNG, JPG, or WEBP (Max 2MB)</p>
            </div>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-[1px] bg-neutral-800"></div>
              <span className="text-[10px] font-extrabold text-neutral-500 uppercase">OR Image Link</span>
              <div className="flex-1 h-[1px] bg-neutral-800"></div>
            </div>

            <input 
              type="url"
              placeholder="Paste image URL (https://...)"
              value={image.startsWith('data:image') ? '' : image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-all"
            />

            {image && (
              <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-neutral-800 shadow-md">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute top-1 right-1 bg-rose-600 text-white rounded-full text-[10px] w-5 h-5 font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 text-xs font-black uppercase tracking-wider text-white rounded-xl transition-all shadow-lg cursor-pointer ${
                isSubmitting 
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? 'Publishing Service...' : 'Publish to Store Catalog'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProperty;