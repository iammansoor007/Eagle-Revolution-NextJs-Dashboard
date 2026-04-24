const fs = require('fs');
let content = fs.readFileSync('src/app/admin/pages/home/page.tsx', 'utf8');

const replacementBlock = `            {activeTab === "whyChooseUs" && (
              <motion.div key="whyChooseUs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Why Choose Us</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage the features, stats, and the big call-to-action banner.</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Section 7</span>
                </div>

                {/* Section Headers */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Section Headers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Badge</label>
                      <input
                        type="text"
                        value={data.whyChooseUs?.section?.badge || ""}
                        onChange={(e) => setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, section: { ...prev.whyChooseUs.section, badge: e.target.value } } }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Headline</label>
                      <input
                        type="text"
                        value={data.whyChooseUs?.section?.headline || ""}
                        onChange={(e) => setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, section: { ...prev.whyChooseUs.section, headline: e.target.value } } }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Description</label>
                      <textarea
                        rows={2}
                        value={data.whyChooseUs?.section?.description || ""}
                        onChange={(e) => setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, section: { ...prev.whyChooseUs.section, description: e.target.value } } }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Features (Cards) */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Feature Cards</h3>
                    <button
                      onClick={() => {
                        const newFeatures = [...(data.whyChooseUs?.features || []), { title: "New Feature", description: "Description...", icon: "CheckCircle2" }];
                        setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                      }}
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                    >
                      + Add Card
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.whyChooseUs?.features?.map((feature, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-4 flex gap-4 bg-gray-50 relative group">
                        <button
                          onClick={() => {
                            const newFeatures = [...data.whyChooseUs.features];
                            newFeatures.splice(idx, 1);
                            setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                          }}
                          className="absolute top-3 right-3 text-xs font-semibold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                        <div className="w-1/4 space-y-2">
                          <label className="text-[10px] uppercase text-gray-500 font-bold">Icon</label>
                          <select
                            value={feature.icon}
                            onChange={(e) => {
                              const newFeatures = [...data.whyChooseUs.features];
                              newFeatures[idx].icon = e.target.value;
                              setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                            }}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          >
                            <option value="Veteran">Veteran (Custom)</option>
                            <option value="Experience">Experience (Custom)</option>
                            <option value="Warranty">Warranty (Custom)</option>
                            <option value="Financing">Financing (Custom)</option>
                            <option value="Certified">Certified (Custom)</option>
                            <option value="Community">Community (Custom)</option>
                            <option value="Shield">Shield (Lucide)</option>
                            <option value="Star">Star (Lucide)</option>
                            <option value="CheckCircle2">Check (Lucide)</option>
                            <option value="Award">Award (Lucide)</option>
                          </select>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...data.whyChooseUs.features];
                                newFeatures[idx].title = e.target.value;
                                setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Description</label>
                            <textarea
                              rows={2}
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...data.whyChooseUs.features];
                                newFeatures[idx].description = e.target.value;
                                setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, features: newFeatures } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Stats Grid</h3>
                    <button
                      onClick={() => {
                        const newStats = [...(data.whyChooseUs?.stats || []), { label: "New Stat", value: "0", suffix: "+" }];
                        setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                      }}
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                    >
                      + Add Stat
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {data.whyChooseUs?.stats?.map((stat, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-3 bg-gray-50 relative group">
                        <button
                          onClick={() => {
                            const newStats = [...data.whyChooseUs.stats];
                            newStats.splice(idx, 1);
                            setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                          }}
                          className="absolute top-1 right-1 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 rounded opacity-0 group-hover:opacity-100"
                        >
                          X
                        </button>
                        <div className="space-y-2">
                          <div>
                            <label className="text-[9px] uppercase text-gray-500 font-bold">Label</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...data.whyChooseUs.stats];
                                newStats[idx].label = e.target.value;
                                setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-[9px] uppercase text-gray-500 font-bold">Value</label>
                              <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => {
                                  const newStats = [...data.whyChooseUs.stats];
                                  newStats[idx].value = e.target.value;
                                  setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                                }}
                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-primary/50 focus:outline-none"
                              />
                            </div>
                            <div className="w-10">
                              <label className="text-[9px] uppercase text-gray-500 font-bold">Suffix</label>
                              <input
                                type="text"
                                value={stat.suffix || ""}
                                onChange={(e) => {
                                  const newStats = [...data.whyChooseUs.stats];
                                  newStats[idx].suffix = e.target.value;
                                  setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, stats: newStats } }));
                                }}
                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs focus:border-primary/50 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Banner */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">CTA Banner (Bottom)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Offer Badge</label>
                        <input
                          type="text"
                          value={data.whyChooseUs?.cta?.badge || ""}
                          onChange={(e) => setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, badge: e.target.value } } }))}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Title</label>
                        <input
                          type="text"
                          value={data.whyChooseUs?.cta?.title || ""}
                          onChange={(e) => setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, title: e.target.value } } }))}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Description</label>
                      <textarea
                        rows={2}
                        value={data.whyChooseUs?.cta?.description || ""}
                        onChange={(e) => setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, description: e.target.value } } }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Trust Badges (Comma separated)</label>
                      <input
                        type="text"
                        value={data.whyChooseUs?.cta?.trustBadges?.join(', ') || ""}
                        onChange={(e) => setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, trustBadges: e.target.value.split(',').map(s=>s.trim()).filter(Boolean) } } }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-primary/50 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">CTA Buttons</h4>
                      {data.whyChooseUs?.cta?.buttons?.map((btn, idx) => (
                        <div key={idx} className="flex gap-4 items-end">
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase">Button Label</label>
                            <input
                              type="text"
                              value={btn.text}
                              onChange={(e) => {
                                const newBtns = [...data.whyChooseUs.cta.buttons];
                                newBtns[idx].text = e.target.value;
                                setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, buttons: newBtns } } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] text-gray-500 uppercase">Destination Link</label>
                            <input
                              type="text"
                              value={btn.href}
                              onChange={(e) => {
                                const newBtns = [...data.whyChooseUs.cta.buttons];
                                newBtns[idx].href = e.target.value;
                                setData((prev) => ({ ...prev, whyChooseUs: { ...prev.whyChooseUs, cta: { ...prev.whyChooseUs.cta, buttons: newBtns } } }));
                              }}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}`;

content = content.replace(/\{activeTab === "whyChooseUs" && \([\s\S]*?\)\s*\}\s*\{activeTab === "quote" && \(/, replacementBlock + '\n\n            {activeTab === "quote" && (');

fs.writeFileSync('src/app/admin/pages/home/page.tsx', content);
console.log('Successfully replaced whyChooseUs block');
