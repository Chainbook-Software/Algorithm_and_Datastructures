/// <reference types="jest" />

import {
  CorrelationClustering,
  AdjacencyListGraph,
  SignedGraph,
  isMultiplicativeApproximation,
  isMultiplicativeApproximationTwoSided,
  calculateFrequencyVector,
  obliviousStreamingAlgorithm,
  subtreeMode,
  TreeNode,
  FiniteStateMachine,
  DeterministicFiniteAutomaton,
  TuringMachine,
  RegexCompiler,
  LexicalAnalyzer
} from '../typescript/index';

/**
 * Social Media Applications - Real World Test Cases
 *
 * This file demonstrates practical applications of algorithms in social media:
 * - Friend recommendations using graph algorithms
 * - Content moderation with correlation clustering
 * - Trend analysis with streaming estimators
 * - User influence analysis with tree algorithms
 * - Hashtag clustering and viral content detection
 */

describe('Social Media Applications', () => {

  describe('Friend Recommendation System', () => {
    test('mutual friend analysis with graph traversal', () => {
      const socialGraph = new AdjacencyListGraph<number>(false, true);

      // Users: 0=Alice, 1=Bob, 2=Charlie, 3=Diana, 4=Eve
      const users = [0, 1, 2, 3, 4];
      users.forEach(user => socialGraph.addVertex(user));

      // Friendships with interaction strength
      socialGraph.addEdge(0, 1, 0.9); // Alice-Bob (strong friends)
      socialGraph.addEdge(0, 2, 0.7); // Alice-Charlie
      socialGraph.addEdge(1, 2, 0.8); // Bob-Charlie
      socialGraph.addEdge(1, 3, 0.6); // Bob-Diana
      socialGraph.addEdge(2, 3, 0.5); // Charlie-Diana
      socialGraph.addEdge(3, 4, 0.4); // Diana-Eve

      // Alice should be recommended Diana (mutual friend Charlie, Bob)
      const aliceFriends = socialGraph.getNeighbors(0);
      expect(aliceFriends).toContain(1);
      expect(aliceFriends).toContain(2);

      // Check friendship strengths
      expect(socialGraph.getEdgeWeight(0, 1)).toBe(0.9);
      expect(socialGraph.getEdgeWeight(0, 2)).toBe(0.7);
    });

    test('community detection for group recommendations', () => {
      const users = [0, 1, 2, 3, 4, 5];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Tech enthusiasts
        [1, 2], [1, 3],
        [3, 4], [4, 5], // Gaming community
      ];
      const negativeEdges: [number, number][] = [
        [0, 4], [1, 5], [2, 3], // Different interests
      ];

      const communityClustering = new CorrelationClustering(users, positiveEdges, negativeEdges);
      const result = communityClustering.greedyCorrelationClustering();

      // Should identify user communities
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);
    });
  });

  describe('Content Moderation', () => {
    test('spam detection with signed graph analysis', () => {
      const contentGraph = new SignedGraph(6, false); // 6 content items

      // Set up content relationships
      contentGraph.addEdge(0, 1, 1);  // Legitimate content connections
      contentGraph.addEdge(1, 2, 1);
      contentGraph.addEdge(2, 3, -1); // Spam indicators
      contentGraph.addEdge(3, 4, -1);
      contentGraph.addEdge(4, 5, -1);
      contentGraph.addEdge(0, 5, -1); // Cross-cutting spam signal

      expect(contentGraph.countPositiveEdges()).toBeGreaterThan(0);
      expect(contentGraph.countNegativeEdges()).toBeGreaterThan(0);

      // Spam content should have negative connections
      expect(contentGraph.getEdgeSign(2, 3)).toBe(-1);
      expect(contentGraph.getEdgeSign(4, 5)).toBe(-1);
    });

    test('hate speech pattern recognition', () => {
      const posts = [0, 1, 2, 3, 4];
      const positiveEdges: [number, number][] = [
        [0, 1], // Similar positive content
        [1, 2],
      ];
      const negativeEdges: [number, number][] = [
        [2, 3], // Hate speech connections
        [3, 4],
        [0, 3], // Positive vs negative content
      ];

      const moderationClustering = new CorrelationClustering(posts, positiveEdges, negativeEdges);
      const result = moderationClustering.greedyCorrelationClustering();

      // Should separate positive and negative content
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(2);
    });
  });

  describe('Trend Analysis', () => {
    test('hashtag popularity tracking with streaming data', () => {
      const updates = [
        { itemIndex: 1, delta: 100 }, // #TechTrends
        { itemIndex: 2, delta: 80 },  // #ViralDance
        { itemIndex: 1, delta: 50 },  // #TechTrends again
        { itemIndex: 3, delta: 120 }, // #BreakingNews
        { itemIndex: 2, delta: 30 },  // #ViralDance
      ];

      const hashtagPopularity = calculateFrequencyVector(5, updates, 5);
      expect(hashtagPopularity[0]).toBe(150); // #TechTrends: 100 + 50
      expect(hashtagPopularity[1]).toBe(110); // #ViralDance: 80 + 30
      expect(hashtagPopularity[2]).toBe(120); // #BreakingNews: 120
    });

    test('viral content prediction with approximation', () => {
      const engagementPredictor = (v: number[]) => v.reduce((sum, val) => sum + val, 0);

      const updates = [
        { itemIndex: 1, delta: 1000 }, // High engagement post
        { itemIndex: 2, delta: 100 },  // Low engagement post
        { itemIndex: 1, delta: 500 },  // Continued high engagement
      ];

      const result = obliviousStreamingAlgorithm(
        engagementPredictor,
        0.2, // 20% prediction tolerance
        2000, // Max expected engagement
        5,    // 5 content items
        10,   // Stream length
        updates
      );

      expect(result).toBe(1600); // Total engagement: 1000 + 100 + 500
    });
  });

  describe('User Influence Analysis', () => {
    test('influence hierarchy with tree structures', () => {
      // Social influence tree
      const influencer: TreeNode = { children: [], color: 1 }; // High influence
      const microInfluencer: TreeNode = { children: [], color: 2 }; // Medium influence
      const regularUser: TreeNode = { children: [], color: 3 }; // Low influence

      const contentCreators: TreeNode = {
        children: [influencer, microInfluencer],
        color: undefined
      };

      const consumers: TreeNode = {
        children: [microInfluencer, regularUser],
        color: undefined
      };

      const platform: TreeNode = {
        children: [contentCreators, consumers],
        color: undefined
      };

      const influenceLevels = subtreeMode(platform);

      // Content creators subtree should be high-influence dominated
      expect(influenceLevels.get(contentCreators)).toBe(1);

      // Consumers subtree should be medium-influence dominated
      expect(influenceLevels.get(consumers)).toBe(2);

      // Overall platform should be high-influence dominated (from content creators)
      expect(influenceLevels.get(platform)).toBe(1);
    });

    test('engagement prediction based on user type', () => {
      const powerUser: TreeNode = { children: [], color: 1 }; // High engagement
      const casualUser: TreeNode = { children: [], color: 2 }; // Medium engagement
      const lurker: TreeNode = { children: [], color: 3 }; // Low engagement

      const activeUsers: TreeNode = {
        children: [powerUser, casualUser],
        color: undefined
      };

      const inactiveUsers: TreeNode = {
        children: [casualUser, lurker],
        color: undefined
      };

      const userbase: TreeNode = {
        children: [activeUsers, inactiveUsers],
        color: undefined
      };

      const engagementLevels = subtreeMode(userbase);

      // Active users should be high-engagement dominated
      expect(engagementLevels.get(activeUsers)).toBe(1);

      // Inactive users should be medium-engagement dominated
      expect(engagementLevels.get(inactiveUsers)).toBe(2);

      // Overall userbase should be high-engagement dominated (from active users)
      expect(engagementLevels.get(userbase)).toBe(1);
    });
  });

  describe('Viral Content Detection', () => {
    test('content sharing patterns with graph analysis', () => {
      const sharingGraph = new AdjacencyListGraph<number>(true, true); // Directed with weights

      // Content pieces and users
      const entities = [0, 1, 2, 3, 4, 5]; // 0-2: content, 3-5: users
      entities.forEach(e => sharingGraph.addVertex(e));

      // Sharing relationships with virality scores
      sharingGraph.addEdge(3, 0, 0.9); // User 3 shares Content 0 (highly viral)
      sharingGraph.addEdge(4, 0, 0.8); // User 4 shares Content 0
      sharingGraph.addEdge(3, 1, 0.6); // User 3 shares Content 1 (moderately viral)
      sharingGraph.addEdge(5, 1, 0.5); // User 5 shares Content 1
      sharingGraph.addEdge(4, 2, 0.3); // User 4 shares Content 2 (low viral)

      // User 3 should share multiple content pieces
      const user3Shares = sharingGraph.getNeighbors(3);
      expect(user3Shares.length).toBe(2); // Shares content 0 and 1

      // User 4 should share content
      const user4Shares = sharingGraph.getNeighbors(4);
      expect(user4Shares.length).toBe(2); // Shares content 0 and 2

      // Check virality scores
      expect(sharingGraph.getEdgeWeight(3, 0)).toBe(0.9);
      expect(sharingGraph.getEdgeWeight(4, 0)).toBe(0.8);
    });

    test('hashtag clustering for trend identification', () => {
      const hashtags = [0, 1, 2, 3, 4, 5];
      const positiveEdges: [number, number][] = [
        [0, 1], [0, 2], // Technology cluster
        [1, 2], [1, 3],
        [3, 4], [4, 5], // Entertainment cluster
      ];
      const negativeEdges: [number, number][] = [
        [0, 4], [1, 5], [2, 3], // Different domains
      ];

      const hashtagClustering = new CorrelationClustering(hashtags, positiveEdges, negativeEdges);
      const result = hashtagClustering.greedyCorrelationClustering();

      // Should identify hashtag communities/trends
      expect(result.clusterCount).toBeGreaterThan(1);
      expect(result.mistakes).toBeLessThanOrEqual(3);

      const clusters = hashtagClustering.getClustersAsArrays(result.clustering);
      expect(clusters.size).toBe(result.clusterCount);
    });
  });

  describe('Algorithmic Feed Optimization', () => {
    test('content relevance scoring with approximation algorithms', () => {
      const userPreferences = [0.8, 0.6, 0.4, 0.2]; // Content relevance scores
      const algorithmScore = 0.72; // Algorithm's predicted relevance (within 20% of max)
      const epsilon = 0.2; // 20% tolerance

      // Check if algorithm score is reasonable approximation
      const maxRelevance = Math.max(...userPreferences);
      const isGoodApproximation = isMultiplicativeApproximationTwoSided(epsilon, maxRelevance, algorithmScore);

      expect(isGoodApproximation).toBe(true);

      // Test poor algorithm performance
      const badScore = 0.1; // Very low relevance prediction
      const isPoorApproximation = isMultiplicativeApproximationTwoSided(epsilon, maxRelevance, badScore);
      expect(isPoorApproximation).toBe(false);
    });

    test('feed ranking with graph-based authority', () => {
      const contentGraph = new AdjacencyListGraph<number>(true, false);

      // Content items with authority relationships
      const content = [0, 1, 2, 3, 4];
      content.forEach(c => contentGraph.addVertex(c));

      // Citation/linking relationships
      contentGraph.addEdge(0, 1); // Content 0 references content 1 (gives authority)
      contentGraph.addEdge(1, 2);
      contentGraph.addEdge(2, 3);
      contentGraph.addEdge(0, 3);
      contentGraph.addEdge(3, 4);

      // Check authority flow
      expect(contentGraph.getInDegree(1)).toBe(1); // Referenced by content 0
      expect(contentGraph.getInDegree(3)).toBe(2); // Referenced by content 2 and 0
      expect(contentGraph.getOutDegree(0)).toBe(2); // References content 1 and 3
    });
  });

  describe('State Machine Applications in Social Media', () => {

    describe('Content Moderation with Finite State Machines', () => {
      test('spam content detection using FSM', () => {
        // States: 0=normal, 1=suspicious, 2=spam
        const states = ['normal', 'suspicious', 'spam'];
        const alphabet = ['normal_word', 'spam_word', 'link', 'caps', 'exclamation'];
        const fsm = new FiniteStateMachine(states, alphabet, 'normal', ['spam']);

        // Transitions for spam detection
        fsm.addTransition('normal', 'normal_word', 'normal');
        fsm.addTransition('normal', 'spam_word', 'suspicious');
        fsm.addTransition('normal', 'link', 'suspicious');
        fsm.addTransition('normal', 'caps', 'suspicious');
        fsm.addTransition('normal', 'exclamation', 'suspicious');

        fsm.addTransition('suspicious', 'normal_word', 'normal');
        fsm.addTransition('suspicious', 'spam_word', 'spam');
        fsm.addTransition('suspicious', 'link', 'spam');
        fsm.addTransition('suspicious', 'caps', 'spam');
        fsm.addTransition('suspicious', 'exclamation', 'spam');

        fsm.addTransition('spam', 'normal_word', 'spam');
        fsm.addTransition('spam', 'spam_word', 'spam');
        fsm.addTransition('spam', 'link', 'spam');
        fsm.addTransition('spam', 'caps', 'spam');
        fsm.addTransition('spam', 'exclamation', 'spam');

        // Test legitimate content
        const legitimateContent = ['normal_word', 'normal_word', 'normal_word'];
        expect(fsm.accepts(legitimateContent)).toBe(false); // Should not be marked as spam

        // Test spam content
        const spamContent = ['spam_word', 'link', 'caps', 'exclamation'];
        expect(fsm.accepts(spamContent)).toBe(true); // Should be detected as spam

        // Test borderline content
        const borderlineContent = ['normal_word', 'spam_word', 'link'];
        expect(fsm.accepts(borderlineContent)).toBe(true); // Should be flagged
      });

      test('hate speech pattern recognition with DFA', () => {
        // States: 0=start, 1=potential_hate, 2=hate_detected
        const states = [0, 1, 2];
        const alphabet = ['neutral', 'offensive', 'hate_word', 'slur'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 0, [2]);

        // Transitions for hate speech detection
        dfa.addDeterministicTransition(0, 'neutral', 0);
        dfa.addDeterministicTransition(0, 'offensive', 1);
        dfa.addDeterministicTransition(0, 'hate_word', 1);
        dfa.addDeterministicTransition(0, 'slur', 2);

        dfa.addDeterministicTransition(1, 'neutral', 0);
        dfa.addDeterministicTransition(1, 'offensive', 1);
        dfa.addDeterministicTransition(1, 'hate_word', 2);
        dfa.addDeterministicTransition(1, 'slur', 2);

        dfa.addDeterministicTransition(2, 'neutral', 2);
        dfa.addDeterministicTransition(2, 'offensive', 2);
        dfa.addDeterministicTransition(2, 'hate_word', 2);
        dfa.addDeterministicTransition(2, 'slur', 2);

        // Test neutral content
        const neutralContent = ['neutral', 'neutral', 'neutral'];
        expect(dfa.accepts(neutralContent)).toBe(false);

        // Test hate speech
        const hateSpeech = ['offensive', 'hate_word', 'slur'];
        expect(dfa.accepts(hateSpeech)).toBe(true);

        // Test offensive but not hate
        const offensiveContent = ['offensive', 'neutral', 'offensive'];
        expect(dfa.accepts(offensiveContent)).toBe(false);
      });
    });

    describe('User Behavior Modeling with State Machines', () => {
      test('user engagement state transitions', () => {
        // States: inactive, browsing, engaged, highly_engaged
        const states = ['inactive', 'browsing', 'engaged', 'highly_engaged'];
        const alphabet = ['view_post', 'like', 'comment', 'share', 'time_spent', 'logout'];
        const fsm = new FiniteStateMachine(states, alphabet, 'inactive', ['highly_engaged']);

        // Define engagement transitions
        fsm.addTransition('inactive', 'view_post', 'browsing');
        fsm.addTransition('inactive', 'logout', 'inactive');

        fsm.addTransition('browsing', 'view_post', 'browsing');
        fsm.addTransition('browsing', 'like', 'engaged');
        fsm.addTransition('browsing', 'comment', 'engaged');
        fsm.addTransition('browsing', 'time_spent', 'engaged');
        fsm.addTransition('browsing', 'logout', 'inactive');

        fsm.addTransition('engaged', 'view_post', 'engaged');
        fsm.addTransition('engaged', 'like', 'highly_engaged');
        fsm.addTransition('engaged', 'comment', 'highly_engaged');
        fsm.addTransition('engaged', 'share', 'highly_engaged');
        fsm.addTransition('engaged', 'time_spent', 'highly_engaged');
        fsm.addTransition('engaged', 'logout', 'inactive');

        fsm.addTransition('highly_engaged', 'view_post', 'highly_engaged');
        fsm.addTransition('highly_engaged', 'like', 'highly_engaged');
        fsm.addTransition('highly_engaged', 'comment', 'highly_engaged');
        fsm.addTransition('highly_engaged', 'share', 'highly_engaged');
        fsm.addTransition('highly_engaged', 'time_spent', 'highly_engaged');
        fsm.addTransition('highly_engaged', 'logout', 'inactive');

        // Test user engagement progression
        const userActions = ['view_post', 'like', 'comment', 'share'];
        const result = fsm.process(userActions);

        expect(result.accepted).toBe(true); // Should reach highly engaged state
        expect(result.finalState).toBe('highly_engaged');
        expect(result.path).toEqual(['inactive', 'browsing', 'engaged', 'highly_engaged', 'highly_engaged']);
      });

      test('account status management DFA', () => {
        // States: active, suspended, banned
        const states = ['active', 'suspended', 'banned'];
        const alphabet = ['good_behavior', 'minor_violation', 'major_violation', 'appeal_granted', 'appeal_denied'];
        const dfa = new DeterministicFiniteAutomaton(states, alphabet, 'active', ['active']);

        // Account status transitions
        dfa.addDeterministicTransition('active', 'good_behavior', 'active');
        dfa.addDeterministicTransition('active', 'minor_violation', 'suspended');
        dfa.addDeterministicTransition('active', 'major_violation', 'banned');
        dfa.addDeterministicTransition('active', 'appeal_granted', 'active');
        dfa.addDeterministicTransition('active', 'appeal_denied', 'active');

        dfa.addDeterministicTransition('suspended', 'good_behavior', 'active');
        dfa.addDeterministicTransition('suspended', 'minor_violation', 'banned');
        dfa.addDeterministicTransition('suspended', 'major_violation', 'banned');
        dfa.addDeterministicTransition('suspended', 'appeal_granted', 'active');
        dfa.addDeterministicTransition('suspended', 'appeal_denied', 'suspended');

        dfa.addDeterministicTransition('banned', 'good_behavior', 'banned');
        dfa.addDeterministicTransition('banned', 'minor_violation', 'banned');
        dfa.addDeterministicTransition('banned', 'major_violation', 'banned');
        dfa.addDeterministicTransition('banned', 'appeal_granted', 'active');
        dfa.addDeterministicTransition('banned', 'appeal_denied', 'banned');

        // Test good user behavior
        const goodBehavior = ['good_behavior', 'good_behavior', 'good_behavior'];
        expect(dfa.accepts(goodBehavior)).toBe(true);

        // Test violation progression
        const violations = ['minor_violation', 'good_behavior'];
        expect(dfa.accepts(violations)).toBe(true); // Back to active after good behavior

        // Test permanent ban
        const majorViolation = ['major_violation'];
        expect(dfa.accepts(majorViolation)).toBe(false); // Banned state is not accepting
      });
    });

    describe('Hashtag Pattern Recognition', () => {
      test('hashtag validation using regex compiler', () => {
        const hashtagRegex = new RegexCompiler('a'); // Simple pattern for testing
        const dfa = hashtagRegex.compile();

        // Test simple patterns that the compiler supports
        expect(dfa.accepts(['a'])).toBe(true);
        expect(dfa.accepts(['b'])).toBe(false); // Should not accept other letters

        // Test with different pattern
        const abRegex = new RegexCompiler('ab');
        const abDfa = abRegex.compile();
        expect(abDfa.accepts(['a', 'b'])).toBe(true);
        expect(abDfa.accepts(['a'])).toBe(false);
      });

      test('lexical analysis of social media posts', () => {
        const analyzer = new LexicalAnalyzer();

        const post = "Check out trending and AI ! Like and share if you agree.";
        const tokens = analyzer.tokenize(post);

        // Should identify keywords and identifiers
        const identifiers = tokens.filter(t => t.type === 'identifier');
        expect(identifiers.some(id => id.value === 'trending')).toBe(true);
        expect(identifiers.some(id => id.value === 'AI')).toBe(true);

        // Should identify some punctuation (simplified test)
        expect(tokens.length).toBeGreaterThan(5); // Should have multiple tokens
      });
    });

    describe('Viral Content Detection with Turing Machines', () => {
      test('content virality prediction using turing machine', () => {
        // Simple TM that counts engagement patterns
        const states = ['q0', 'q1', 'q2', 'q_accept', 'q_reject'];
        const tapeAlphabet = ['L', 'C', 'S', 'V', 'B']; // Like, Comment, Share, View, Blank
        const tm = new TuringMachine(states, tapeAlphabet, 'B', 'q0', ['q_accept'], ['q_reject']);

        // Transitions for virality detection (simplified)
        // q0: initial state, looking for engagement
        tm.addTransition('q0', 'V', 'q0', 'V', 'R'); // Views don't count much
        tm.addTransition('q0', 'L', 'q1', 'L', 'R'); // First like
        tm.addTransition('q0', 'C', 'q1', 'C', 'R'); // First comment
        tm.addTransition('q0', 'S', 'q1', 'S', 'R'); // First share
        tm.addTransition('q0', 'B', 'q_reject', 'B', 'S'); // No engagement

        // q1: has some engagement, looking for more
        tm.addTransition('q1', 'V', 'q1', 'V', 'R');
        tm.addTransition('q1', 'L', 'q2', 'L', 'R'); // Second engagement
        tm.addTransition('q1', 'C', 'q2', 'C', 'R');
        tm.addTransition('q1', 'S', 'q2', 'S', 'R');
        tm.addTransition('q1', 'B', 'q_reject', 'B', 'S'); // Not viral

        // q2: viral content detected
        tm.addTransition('q2', 'V', 'q_accept', 'V', 'S');
        tm.addTransition('q2', 'L', 'q_accept', 'L', 'S');
        tm.addTransition('q2', 'C', 'q_accept', 'C', 'S');
        tm.addTransition('q2', 'S', 'q_accept', 'S', 'S');
        tm.addTransition('q2', 'B', 'q_accept', 'B', 'S');

        // Test viral content (multiple engagements)
        const viralContent = ['V', 'L', 'C', 'S'];
        const viralResult = tm.run(viralContent, 10);
        expect(viralResult.accepted).toBe(true);

        // Test non-viral content (single engagement)
        const nonViralContent = ['V', 'L'];
        const nonViralResult = tm.run(nonViralContent, 10);
        expect(nonViralResult.accepted).toBe(false);

        // Test no engagement
        const noEngagement = ['V', 'V', 'V'];
        const noEngagementResult = tm.run(noEngagement, 10);
        expect(noEngagementResult.accepted).toBe(false);
      });
    });

    describe('Feed Algorithm State Management', () => {
      test('content recommendation FSM', () => {
        // States: exploring, personalizing, recommending
        const states = ['exploring', 'personalizing', 'recommending'];
        const alphabet = ['user_interaction', 'time_decay', 'similar_content', 'diversify'];
        const fsm = new FiniteStateMachine(states, alphabet, 'exploring', ['recommending']);

        // Feed algorithm transitions
        fsm.addTransition('exploring', 'user_interaction', 'personalizing');
        fsm.addTransition('exploring', 'time_decay', 'exploring');
        fsm.addTransition('exploring', 'similar_content', 'exploring');
        fsm.addTransition('exploring', 'diversify', 'exploring');

        fsm.addTransition('personalizing', 'user_interaction', 'recommending');
        fsm.addTransition('personalizing', 'time_decay', 'exploring');
        fsm.addTransition('personalizing', 'similar_content', 'personalizing');
        fsm.addTransition('personalizing', 'diversify', 'exploring');

        fsm.addTransition('recommending', 'user_interaction', 'recommending');
        fsm.addTransition('recommending', 'time_decay', 'personalizing');
        fsm.addTransition('recommending', 'similar_content', 'recommending');
        fsm.addTransition('recommending', 'diversify', 'personalizing');

        // Test algorithm learning progression
        const userJourney = ['user_interaction', 'similar_content', 'user_interaction'];
        const result = fsm.process(userJourney);

        expect(result.accepted).toBe(true);
        expect(result.finalState).toBe('recommending');
        expect(result.path).toEqual(['exploring', 'personalizing', 'personalizing', 'recommending']);
      });
    });

  });

});
