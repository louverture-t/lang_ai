import { useState } from 'react';
import { isValidApiKey } from '@/lib/chatConfig';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Key } from 'lucide-react';

interface ApiKeyConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (apiKey: string) => void;
}

export function ApiKeyConfig({ open, onOpenChange, onSave }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // Clear previous errors
    setError('');

    // Basic validation
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    // Validate OpenAI API key format using centralized validator
    if (!isValidApiKey(apiKey.trim())) {
      setError('Invalid API key format. OpenAI keys must start with "sk-" and be at least 20 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // Save trimmed API key to localStorage
      const trimmedKey = apiKey.trim();
      localStorage.setItem('openai-api-key', trimmedKey);

      // Call parent callback
      onSave(trimmedKey);

      // Close modal
      onOpenChange(false);

      // Clear form
      setApiKey('');
    } catch (err) {
      setError('Failed to save API key. Please try again.');
      console.error('Error saving API key:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setApiKey('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configure OpenAI API Key
          </DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to enable AI features. Your key will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Security Warning */}
          <div className="flex gap-3 rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
            <div className="space-y-1">
              <p className="font-medium text-warning">Security Notice</p>
              <p className="text-warning/90">
                Your API key will be stored in your browser's localStorage and exposed in client-side code.
                For production apps, use a backend proxy to protect your keys.
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="grid gap-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              disabled={isLoading}
              className={error ? 'border-error focus-visible:ring-error' : ''}
            />
            {error && (
              <p className="text-sm text-error flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                platform.openai.com/api-keys
              </a>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
