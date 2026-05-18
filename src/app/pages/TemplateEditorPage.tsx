import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Eye, Trash2, GripVertical, FileText, BarChart3, Image as ImageIcon, Type, Edit3 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

interface TemplateBlock {
  id: string;
  type: 'title' | 'text' | 'table' | 'chart' | 'photo' | 'signature';
  content: string;
  settings?: any;
}

export function TemplateEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [templateName, setTemplateName] = useState(
    isEditMode ? 'Standard Liquidation Report' : ''
  );
  const [templateDescription, setTemplateDescription] = useState(
    isEditMode ? 'COA-compliant liquidation template' : ''
  );
  const [showPreview, setShowPreview] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const [blocks, setBlocks] = useState<TemplateBlock[]>(
    isEditMode
      ? [
          { id: '1', type: 'title', content: 'LIQUIDATION REPORT' },
          { id: '2', type: 'text', content: 'Event Information' },
          { id: '3', type: 'table', content: 'Budget Summary Table' },
          { id: '4', type: 'signature', content: 'Signature Block' },
        ]
      : []
  );

  const blockTypes = [
    { type: 'title', icon: Type, label: 'Title Block', description: 'Large heading text' },
    { type: 'text', icon: FileText, label: 'Text Section', description: 'Paragraph or description' },
    { type: 'table', icon: Edit3, label: 'Table', description: 'Data table' },
    { type: 'chart', icon: BarChart3, label: 'Chart', description: 'Visual data representation' },
    { type: 'photo', icon: ImageIcon, label: 'Photo Section', description: 'Image grid' },
    { type: 'signature', icon: Edit3, label: 'Signature Block', description: 'Signature fields' },
  ];

  const addBlock = (type: TemplateBlock['type']) => {
    const newBlock: TemplateBlock = {
      id: Date.now().toString(),
      type,
      content: `New ${type} block`,
    };
    setBlocks([...blocks, newBlock]);
    setShowBlockMenu(false);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < blocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)));
  };

  const handleSave = () => {
    alert('Template saved successfully!');
    navigate('/reports?tab=templates');
  };

  const renderBlockIcon = (type: TemplateBlock['type']) => {
    const blockType = blockTypes.find((bt) => bt.type === type);
    const Icon = blockType?.icon || FileText;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/reports?tab=templates')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl">{isEditMode ? 'Edit' : 'Create'} Template</h1>
          <p className="text-gray-600 mt-2">Design custom report templates with drag-and-drop blocks</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg mb-4">Template Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Standard Liquidation Report"
                />
              </div>
              <div>
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Brief description of this template"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Available Blocks</h3>
            </div>
            <div className="space-y-2">
              {blockTypes.map((blockType) => {
                const Icon = blockType.icon;
                return (
                  <button
                    key={blockType.type}
                    onClick={() => addBlock(blockType.type as TemplateBlock['type'])}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <div className="bg-blue-100 p-2 rounded">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{blockType.label}</p>
                      <p className="text-xs text-gray-600">{blockType.description}</p>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h4 className="text-sm mb-2">Quick Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Drag blocks to reorder them</li>
              <li>• Click on a block to edit its content</li>
              <li>• Use Preview to see the final output</li>
              <li>• Save template for future use</li>
            </ul>
          </Card>
        </div>

        {/* Template Builder */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Template Structure</h3>
              <span className="text-sm text-gray-600">{blocks.length} blocks</span>
            </div>

            {blocks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="mb-2">No Blocks Added</h4>
                <p className="text-sm text-gray-600">
                  Add blocks from the left panel to start building your template
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-1 pt-2">
                      <button
                        onClick={() => moveBlock(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => moveBlock(index, 'down')}
                        disabled={index === blocks.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Block Icon */}
                    <div className="bg-white p-2 rounded">
                      {renderBlockIcon(block.type)}
                    </div>

                    {/* Block Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {block.type}
                        </span>
                      </div>
                      <Input
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        className="bg-white"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeBlock(block.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Preview Section */}
          {blocks.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg mb-4">Live Preview</h3>
              <div className="bg-white border rounded-lg p-8 space-y-6">
                {blocks.map((block) => (
                  <div key={block.id}>
                    {block.type === 'title' && (
                      <h2 className="text-2xl text-center border-b pb-4">{block.content}</h2>
                    )}
                    {block.type === 'text' && (
                      <div>
                        <h3 className="text-lg mb-2 border-b pb-2">{block.content}</h3>
                        <p className="text-gray-600 text-sm">Content will be inserted here...</p>
                      </div>
                    )}
                    {block.type === 'table' && (
                      <div>
                        <h3 className="text-lg mb-2">{block.content}</h3>
                        <div className="border rounded">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border py-2 px-4 text-left">Column 1</th>
                                <th className="border py-2 px-4 text-left">Column 2</th>
                                <th className="border py-2 px-4 text-right">Column 3</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border py-2 px-4">Data</td>
                                <td className="border py-2 px-4">Data</td>
                                <td className="border py-2 px-4 text-right">Data</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {block.type === 'chart' && (
                      <div>
                        <h3 className="text-lg mb-2">{block.content}</h3>
                        <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
                          <BarChart3 className="w-16 h-16 text-gray-400" />
                        </div>
                      </div>
                    )}
                    {block.type === 'photo' && (
                      <div>
                        <h3 className="text-lg mb-2">{block.content}</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {block.type === 'signature' && (
                      <div>
                        <h3 className="text-lg mb-4 border-b pb-2">{block.content}</h3>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="text-center">
                            <div className="border-b border-black mb-2 h-16"></div>
                            <p className="text-sm">Name</p>
                            <p className="text-xs text-gray-600">Position</p>
                          </div>
                          <div className="text-center">
                            <div className="border-b border-black mb-2 h-16"></div>
                            <p className="text-sm">Name</p>
                            <p className="text-xs text-gray-600">Position</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <div className="bg-white p-8 space-y-6 border rounded">
            {blocks.map((block) => (
              <div key={block.id}>
                {block.type === 'title' && (
                  <h2 className="text-2xl text-center border-b pb-4">{block.content}</h2>
                )}
                {block.type === 'text' && (
                  <div>
                    <h3 className="text-lg mb-2 border-b pb-2">{block.content}</h3>
                    <p className="text-gray-600 text-sm">Content will be inserted here...</p>
                  </div>
                )}
                {block.type === 'table' && (
                  <div>
                    <h3 className="text-lg mb-2">{block.content}</h3>
                    <div className="border rounded">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border py-2 px-4 text-left">Column 1</th>
                            <th className="border py-2 px-4 text-left">Column 2</th>
                            <th className="border py-2 px-4 text-right">Column 3</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border py-2 px-4">Data</td>
                            <td className="border py-2 px-4">Data</td>
                            <td className="border py-2 px-4 text-right">Data</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {block.type === 'signature' && (
                  <div>
                    <h3 className="text-lg mb-4 border-b pb-2">{block.content}</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="border-b border-black mb-2 h-16"></div>
                        <p className="text-sm">Name</p>
                        <p className="text-xs text-gray-600">Position</p>
                      </div>
                      <div className="text-center">
                        <div className="border-b border-black mb-2 h-16"></div>
                        <p className="text-sm">Name</p>
                        <p className="text-xs text-gray-600">Position</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
