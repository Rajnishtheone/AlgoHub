import { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { toast } from 'react-hot-toast';

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === 'string' && tags.trim()) return [tags.trim()];
  return [];
};

const sanitizeSuggestions = (data) => ({
  title: typeof data?.title === 'string' ? data.title : '',
  description: typeof data?.description === 'string' ? data.description : '',
  difficulty: typeof data?.difficulty === 'string' ? data.difficulty : '',
  tags: normalizeTags(data?.tags),
  visibleTestCases: Array.isArray(data?.visibleTestCases) ? data.visibleTestCases : [],
  hiddenTestCases: Array.isArray(data?.hiddenTestCases) ? data.hiddenTestCases : [],
  improvements: Array.isArray(data?.improvements) ? data.improvements : []
});

const toVisibleCases = (cases) =>
  cases.map((tc) => ({
    input: tc?.input ?? '',
    output: tc?.output ?? tc?.expectedOutput ?? '',
    explanation: tc?.explanation ?? ''
  }));

const toHiddenCases = (cases) =>
  cases.map((tc) => ({
    input: tc?.input ?? '',
    output: tc?.output ?? tc?.expectedOutput ?? ''
  }));

function AdminProblemAssistant({
  getValues,
  setValue,
  replaceVisible,
  replaceHidden
}) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState('');

  const runAssistant = async (action) => {
    try {
      setLoading(true);
      setError('');
      const payload = getValues();
      const response = await axiosClient.post('/ai/problem-assistant', {
        ...payload,
        topic,
        action
      });
      const data = response.data?.data || response.data;
      const sanitized = sanitizeSuggestions(data);
      setSuggestions(sanitized);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Failed to get AI suggestions';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const applyTitle = () => setValue('title', suggestions?.title || '', { shouldValidate: true });
  const applyDescription = () => setValue('description', suggestions?.description || '', { shouldValidate: true });
  const applyDifficulty = () => setValue('difficulty', suggestions?.difficulty || '', { shouldValidate: true });
  const applyTags = () => setValue('tags', suggestions?.tags || [], { shouldValidate: true });
  const applyVisible = () => replaceVisible(toVisibleCases(suggestions?.visibleTestCases || []));
  const applyHidden = () => replaceHidden(toHiddenCases(suggestions?.hiddenTestCases || []));

  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
      <p className="text-sm text-base-content/70 mb-4">
        Suggestions are shown below and never overwrite your inputs unless you apply them.
      </p>

      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div className="form-control flex-1 min-w-[200px]">
          <label className="label">
            <span className="label-text">Topic (optional)</span>
          </label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input input-bordered"
            placeholder="e.g., Two pointers, BFS, DP on grids"
          />
        </div>
        <button
          type="button"
          onClick={() => runAssistant('enhance')}
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          Enhance with AI
        </button>
        <button
          type="button"
          onClick={() => runAssistant('testcases')}
          className={`btn btn-outline ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          Generate Test Cases
        </button>
        <button
          type="button"
          onClick={() => runAssistant('validate')}
          className={`btn btn-outline ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          Validate Reference Solution
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {!suggestions && !loading && (
        <div className="text-sm text-base-content/60">
          Run the assistant to see improvement suggestions.
        </div>
      )}

      {suggestions && (
        <div className="space-y-6">
          {(suggestions.title || '').length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Suggested Title</h3>
                <button type="button" className="btn btn-xs btn-primary" onClick={applyTitle}>
                  Apply
                </button>
              </div>
              <p className="mt-2 text-sm">{suggestions.title}</p>
            </div>
          )}

          {(suggestions.description || '').length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Suggested Description</h3>
                <button type="button" className="btn btn-xs btn-primary" onClick={applyDescription}>
                  Apply
                </button>
              </div>
              <pre className="mt-2 whitespace-pre-wrap text-sm bg-base-200 p-3 rounded-lg">
                {suggestions.description}
              </pre>
            </div>
          )}

          {(suggestions.difficulty || '').length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Suggested Difficulty</h3>
                <button type="button" className="btn btn-xs btn-primary" onClick={applyDifficulty}>
                  Apply
                </button>
              </div>
              <p className="mt-2 text-sm">{suggestions.difficulty}</p>
            </div>
          )}

          {suggestions.tags?.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Suggested Tags</h3>
                <button type="button" className="btn btn-xs btn-primary" onClick={applyTags}>
                  Apply
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.tags.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="badge badge-outline">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suggestions.visibleTestCases?.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Suggested Visible Test Cases</h3>
                <button type="button" className="btn btn-xs btn-primary" onClick={applyVisible}>
                  Apply
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {suggestions.visibleTestCases.map((tc, idx) => (
                  <div key={`visible-${idx}`} className="bg-base-200 p-3 rounded-lg text-sm">
                    <div><strong>Input:</strong> {tc.input}</div>
                    <div><strong>Output:</strong> {tc.output ?? tc.expectedOutput}</div>
                    {tc.explanation && (
                      <div><strong>Explanation:</strong> {tc.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.hiddenTestCases?.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Suggested Hidden Test Cases</h3>
                <button type="button" className="btn btn-xs btn-primary" onClick={applyHidden}>
                  Apply
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {suggestions.hiddenTestCases.map((tc, idx) => (
                  <div key={`hidden-${idx}`} className="bg-base-200 p-3 rounded-lg text-sm">
                    <div><strong>Input:</strong> {tc.input}</div>
                    <div><strong>Output:</strong> {tc.output ?? tc.expectedOutput}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.improvements?.length > 0 && (
            <div>
              <h3 className="font-semibold">Improvement Notes</h3>
              <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                {suggestions.improvements.map((item, idx) => (
                  <li key={`improvement-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProblemAssistant;
