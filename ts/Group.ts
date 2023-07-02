import { assert } from "./Errors";
import { Matrix } from "./Matrix";

export class Group {
  readonly gens: GroupElement[];
  readonly id: GroupElement;
  private readonly dim: number;
  private readonly fp: number;
  readonly elements: Set<GroupElement>;

  constructor(matrep: Matrix[]) {
    assert(() => matrep.length > 0, "Matrix has no generators");
    assert(
      () => matrep.every((m) => m.dim == matrep[0]!.dim),
      "Generators are matrices of different size"
    );
    assert(
      () => matrep.every((m) => m.fp == matrep[0]!.fp),
      "Generators are matrices of different fp"
    );
    this.gens = matrep.map((m) => new GroupElement(this, m));
    this.dim = matrep[0]!.dim;
    this.fp = matrep[0]!.fp;
    this.id = new GroupElement(this, Matrix.id(this.dim, this.fp));

    this.elements = new Set();
    this.gens.forEach((g) => this.elements.add(g));
    this.elements.add(this.id);
  }

  get ngen(): number {
    return this.gens.length;
  }
}

export class GroupElement {
  constructor(readonly grp: Group, readonly mat: Matrix) {}

  mul(o: GroupElement): GroupElement {
    assert(() => this.grp == o.grp, "Multiplying elements of different groups");

    const g = new GroupElement(this.grp, this.mat.mul(o.mat));
    for (const e of this.grp.elements.values()) if (e.equal(g)) return e;

    this.grp.elements.add(g);
    return g;
  }

  private equal(o: GroupElement) {
    assert(() => this.grp == o.grp, "Comparing elements of different groups");
    return this.mat.equal(o.mat);
  }
}
