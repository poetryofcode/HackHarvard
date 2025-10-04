## Inspiration
We've all experienced that moment in a museum, standing before a masterpiece, wanting to understand its story, but the placard text is too small to read. We wanted to democratize art education and make it accessible to everyone, anywhere. What if every piece of art could speak to you directly, sharing its secrets in a warm, engaging voice? That's the vision behind **Whispering Walls**.

## What it does
Whispering Walls transforms any artwork into an interactive audio experience. Users simply take a photo of a painting, sculpture, or any artwork with their phone, and our AI analyzes it in seconds. The app then generates a rich, emotional audio explanation that covers the artistic style, historical context, techniques used, and fascinating details you might have missed. It's like having a knowledgeable art historian in your pocket, ready to bring any artwork to life.

## How we built it
We built Whispering Walls using a modern tech stack optimized for performance and user experience:

- **Frontend**: Next.js 15 with React 19 and TypeScript for a robust, type-safe application
- **Styling**: Tailwind CSS v4 and shadcn/ui components for a beautiful, responsive interface
- **AI Vision**: OpenAI's GPT-4 Vision API analyzes artwork images and generates detailed, contextual descriptions
- **Voice Synthesis**: ElevenLabs Text-to-Speech API converts descriptions into natural, museum-quality audio
- **Mobile-First**: Implemented HTML5 Media Capture API for seamless camera integration on mobile devices

The architecture follows a clean API route pattern where images are processed through two stages: first analyzed by GPT-4 Vision, then the description is converted to audio by ElevenLabs, creating a smooth pipeline from photo to voice.

## Challenges we ran into
**API Integration Complexity**: Coordinating between OpenAI Vision and ElevenLabs APIs required careful error handling and state management. We had to handle various edge cases like network timeouts, API rate limits, and image format compatibility.

**Mobile Camera Access**: Getting consistent camera capture behavior across different mobile browsers and devices was tricky. We implemented separate input handlers for camera capture versus file upload to ensure reliability.

**Audio Streaming**: Initially, we tried to stream audio in real-time, but latency issues made the experience choppy. We pivoted to generating complete audio files, which improved reliability and allowed for better playback controls.

**Performance Optimization**: Processing high-resolution artwork images was slow. We implemented client-side image compression before upload, reducing processing time by 60% while maintaining visual quality for analysis.

## Accomplishments that we're proud of
We created a fully functional AI pipeline that seamlessly connects vision analysis to voice synthesis, delivering results in under 30 seconds. The custom audio player with progress tracking and transcript display provides an excellent user experience. We're especially proud of the mobile-first design that makes art education accessible anywhere - whether you're in the Louvre or at a local gallery. The app's elegant dark mode and responsive interface demonstrate our commitment to both aesthetics and usability.

## What we learned
This project deepened our understanding of AI API integration and the nuances of working with multimodal AI systems. We learned how to optimize image processing for mobile devices, handle asynchronous API calls gracefully, and create accessible audio experiences. We also gained valuable experience in prompt engineering - crafting the right prompts for GPT-4 Vision to generate engaging, educational content rather than dry descriptions. Most importantly, we learned that the best technology serves a human need, and in this case, making art accessible to everyone.

## What's next for Whispering Walls
**Multi-language Support**: Expand to support audio explanations in multiple languages, making art truly global and accessible.

**Art History Database**: Build a database of famous artworks with curated explanations, allowing offline access to popular pieces.

**Social Features**: Enable users to save favorite artworks, create collections, and share discoveries with friends.

**Museum Partnerships**: Collaborate with museums to provide official audio guides through our platform.

**AR Integration**: Add augmented reality features to overlay historical context and artist information directly on the artwork through the camera view.

**Voice Customization**: Allow users to choose different narrator voices and speaking styles to personalize their experience.

**Educational Mode**: Create a learning mode with quizzes and deeper dives into art movements and techniques.

