/**
 * AGPL-3.0 compliance footer: links to the public source repository.
 *
 * This footer is required by the AGPL-3.0 license under which this
 * software is distributed. If you run a modified version of this
 * software over a network, you must make the modified source available
 * to all users interacting with it remotely.
 *
 * Source: https://github.com/ohmxo/ohmOS
 * License: AGPL-3.0-only
 */

export function AgplFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-1 bg-black/30 px-2 py-0.5 text-[10px] text-white/60 backdrop-blur-sm">
      <span>AGPL-3.0</span>
      <a
       href="https://github.com/ohmxo/ohmOS"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-white/90 transition-colors"
      >
        Source on GitHub
      </a>
    </footer>
  );
}
